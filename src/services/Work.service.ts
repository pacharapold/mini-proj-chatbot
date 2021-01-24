import { ProviderTransferStatus } from '@common/enum/ProviderTransferStatus.enum';
import { Role } from '@common/enum/Role.enum';
import { TxType } from '@common/enum/TxType.enum';
import { WithdrawRequestAction } from '@common/enum/WithdrawRequestAction.enum';
import { WithdrawRequestStatus } from '@common/enum/WithdrawRequestStatus.enum';
import { WorkStatus } from '@common/enum/WorkStatus.enum';
import { EC, Invalid } from '@common/error/Invalid.error';
import GamblerRepository from '@common/repository/Gambler.repository';
import GamblerBankAccountRepository from '@common/repository/GamblerBankAccount.repository';
import NomineeBankAccountRepository from '@common/repository/NomineeBankAccount.repository';
import TxReportRepository from '@common/repository/TxReport.repository';
import WorkRepository from '@common/repository/Work.repository';
import BalanceServiceCommon from '@common/service/Balance.service';
import SiteConfigService from '@common/service/SiteConfig.service';
import { BalanceChange } from '@common/type/BalanceChange.model';
import { IDetailTxReportWork } from '@common/type/DetailTxReport.interface';
import { Gambler } from '@common/type/Gambler.model';
import {
  INomineeBankAccountRefreshBalanceReport,
  INomineeBankAccountRefreshDetailWork,
} from '@common/type/NomineeBankAccount.interface';
import { IOperator } from '@common/type/Operator.interface';
import { Operator } from '@common/type/Operator.model';
import { IWithdrawRequestCreate } from '@common/type/WithdrawRequest.interface';
import {
  IWorkBankWithdraw,
  IWorkCreateDeposit,
} from '@common/type/Work.interface';
import { Work } from '@common/type/Work.model';
import { ITransferResult } from '@common/type/Work.Provider.interface';
import {
  generateSalt,
  loadOrCreateModel,
  sha256Encrypt,
  sleep,
} from '@common/util/common';
import config from '@config/config';
import { transactionGuard } from '@midas-soft/midas-common';
import BalanceService from '@service/Balance.service';
import BalanceChangeService from '@service/BalanceChange.service';
import GamblerBankAccountService from '@service/GamblerBankAccount.service';
import NomineeBankAccountService from '@service/NomineeBankAccount.service';
import WithdrawRequestService from '@service/WithdrawRequest.service';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { Op } from 'sequelize';

export default {
  async getWithdrawCountByGmId(GamblerId: number) {
    return await Work.count({
      where: {
        GamblerId,
        type: TxType.WITHDRAW,
        createTstamp: {
          [Op.gte]: moment(new Date()).startOf('day'),
          [Op.lte]: moment(new Date()).endOf('day'),
        },
      },
    });
  },
  async createWorkImiwin(data: IWorkCreateDeposit) {
    const {
      type,
      detail,
      GamblerId,
      BalanceChangeId,
      agentUserName,
      currencyCode,
    }: IWorkCreateDeposit = data;
    const workImi = await Work.create({
      type,
      currencyCode,
      detail,
      BalanceChangeId,
      GamblerId,
      owner: 'IMIWIN',
      subOwner: agentUserName,
      createTstamp: new Date(),
      seq: new Date(),
    });
    return workImi;
  },
  async createWorkBank(data: IWorkBankWithdraw) {
    const {
      GamblerId,
      NomineeBankAccountId,
      amount,
      currencyCode,
      BalanceChangeId,
    }: IWorkBankWithdraw = data;
    // * Find GamblerBankAccount
    const gmBankAcct = await GamblerBankAccountService.findByGmId(GamblerId);
    if (!gmBankAcct) {
      throw Invalid.badRequest(EC.NOMINEE_BANK_ACCOUNT_DOES_NOT_EXIST);
    }
    // * Find NomineeBankAccount
    const nomineeBankAcct = await NomineeBankAccountService.findOneWithCondition(
      { id: NomineeBankAccountId },
    );
    if (!nomineeBankAcct) {
      throw Invalid.badRequest(EC.NOMINEE_BANK_ACCOUNT_DOES_NOT_EXIST);
    }
    // * Prepare Detail
    const workBank = await Work.create({
      currencyCode,
      BalanceChangeId,
      GamblerId,
      type: TxType.WITHDRAW_BANK,
      owner: nomineeBankAcct.bankCode,
      subOwner: nomineeBankAcct.accountNo,
      createTstamp: new Date(),
      seq: new Date(),
      detail: {
        amount,
        GamblerId: gmBankAcct.GamblerId,
        currencyCode: 'THB',
        ourBankCode: nomineeBankAcct.bankCode,
        ourAccountNo: nomineeBankAcct.accountNo,
        gamblerBankCode: gmBankAcct.bankCode,
        gamblerAccountNo: gmBankAcct.accountNo,
        gamblerAccountName: gmBankAcct.accountName,
      },
    });
    return workBank;
  },
  async findLatestWork(type: TxType[], GamblerId: number) {
    return await Work.findOne({
      where: {
        GamblerId,
        type: { [Op.in]: type },
        completed: false,
        executed: false,
      },
    });
  },
  async findWorkWithAssociationModel(id: number) {
    return await Work.findOne({
      where: { id },
      include: [{ model: BalanceChange }, { model: Gambler }],
    });
  },
  async executeCompleteWork() {
    while (true) {
      // * Find Completed Work
      const completedWk = await Work.findAll({
        where: {
          completed: true,
          completedTstamp: { [Op.ne]: null },
          executed: false,
        },
      });
      // * Executed Completed Work
      for (const wk of completedWk) {
        switch (wk.type) {
          case TxType.DEPOSIT: {
            await this.executedDepositWork(wk.id);
            break;
          }
          case TxType.REDUCE_CREDIT: {
            await this.executedReduceCreditWork(wk.id);
            break;
          }
          case TxType.WITHDRAW: {
            await this.executedWithdrawWork(wk.id);
            break;
          }
          case TxType.WITHDRAW_BANK: {
            await this.executedWithdrawBankWork(wk.id);
            break;
          }
          case TxType.BANK_REPORT: {
            await this.executedReportBankWork(wk.id);
          }
          case TxType.BANK_REFRESH: {
            await this.executedRefreshBalanceWork(wk.id);
          }
        }
        // * Update Gambler
        if (wk.GamblerId) {
          await BalanceServiceCommon.needUpdateProfileUi(
            wk.GamblerId,
            wk.currencyCode,
          );
        }
        // * Update Executed Work
        wk.executed = true;
        wk.executedTstamp = new Date();
        await wk.save();
      }
      // * Sleep Time
      await sleep(1000);
    }
  },
  async executedDepositWork(id: number) {
    const work = await WorkRepository.findById(id);
    if (!work) {
      console.log(`*** deposit work: ${EC[EC.WORK_DOES_NOT_EXIST]}`);
      return;
    }
    const workResult = work.result as ITransferResult;
    if (workResult.status === ProviderTransferStatus.SUCCESS) {
      // * Update Balance && BalanceChange && GamblerProfile
      await BalanceService.updateSuccessDeposit({
        GamblerId: work.GamblerId,
        BalanceChangeId: work.BalanceChangeId,
        currencyCode: work.currencyCode,
        remainingAmount: new BigNumber(workResult.remainingAmount!),
      });
    } else if (workResult.status === ProviderTransferStatus.ERROR) {
      // * Update BalanceChange
      await BalanceChangeService.updateBalanceChangeStatus(
        work.BalanceChangeId,
        WorkStatus.ERROR,
      );
    }
  },
  async executedReduceCreditWork(id: number) {
    const work = await WorkRepository.findById(id);
    if (!work) {
      console.log(`*** reduce credit: ${EC[EC.WORK_DOES_NOT_EXIST]}`);
      return;
    }
    const workResult = work.result as ITransferResult;
    if (workResult.status === ProviderTransferStatus.SUCCESS) {
      await transactionGuard(async () => {
        // * Update Balance
        await BalanceService.updateBalanceByGamblerId(
          work.GamblerId,
          workResult.remainingAmount!,
        );
        // * Update BalanceChange
        await BalanceChangeService.updateBalanceChangeStatus(
          work.BalanceChangeId,
          WorkStatus.SUCCESS,
        );
      });
    } else if (workResult.status === ProviderTransferStatus.ERROR) {
      await transactionGuard(async () => {
        await BalanceChangeService.updateBalanceChangeStatus(
          work.BalanceChangeId,
          WorkStatus.ERROR,
        );
        await BalanceService.gmUpdateBalance(work.GamblerId, work.currencyCode);
      });
    }
  },
  async executedWithdrawWork(id: number) {
    const work = await WorkRepository.findById(id);
    if (!work) {
      console.log(`*** withdraw: ${EC[EC.WORK_DOES_NOT_EXIST]}`);
      return;
    }
    const workResult = work.result as ITransferResult;
    if (workResult.status === ProviderTransferStatus.SUCCESS) {
      const withdrawAmount = new BigNumber(workResult.transferAmount!);
      let withdrawRequestData: IWithdrawRequestCreate;
      // * Find GamblerBankAccount
      const gamblerBankAcct = await GamblerBankAccountRepository.findByGamblerId(
        work.GamblerId,
      );
      if (!gamblerBankAcct) {
        console.log(
          `*** withdraw work: ${EC[EC.GAMBLER_BANK_ACCOUNT_DOES_NOT_EXIST]}`,
        );
        return;
      }
      const gm = await GamblerRepository.findById(gamblerBankAcct.GamblerId);
      if (!gm) return;
      const siteConfig = await SiteConfigService.getSiteConfig(gm.site);
      // * Find System Operator
      const salt = generateSalt();
      const systemOperator: IOperator = await loadOrCreateModel(
        Operator,
        { username: 'system' },
        {
          salt,
          name: 'system',
          username: 'system',
          password: sha256Encrypt(config.ADMIN_PASS, salt, 10),
          telNo: '0811111111',
          role: Role.SUPERVISOR,
        },
      );
      if (withdrawAmount.isLessThanOrEqualTo(siteConfig.maximumWithdrawAuto)) {
        withdrawRequestData = {
          GamblerBankAccountId: gamblerBankAcct.id,
          workImiId: work.id,
          status: WithdrawRequestStatus.WITHDRAWING,
          approveStatus: WithdrawRequestAction.AUTO,
          amount: withdrawAmount,
          tstamp: new Date(),
          detail: {},
          approverId: systemOperator.id,
          reserve: true,
          reserveOperatorId: systemOperator.id,
          reserveTstamp: new Date(),
        };
      } else {
        withdrawRequestData = {
          GamblerBankAccountId: gamblerBankAcct.id,
          workImiId: work.id,
          status: WithdrawRequestStatus.NEW,
          approveStatus: WithdrawRequestAction.WAITING,
          amount: withdrawAmount,
          tstamp: new Date(),
          detail: {},
        };
      }

      await transactionGuard(async () => {
        // * Create WithdrawRequest
        await WithdrawRequestService.createWithdrawRequest(withdrawRequestData);
        // * Update Balance
        await BalanceService.updateBalanceByGamblerId(
          work.GamblerId,
          workResult.remainingAmount!,
        );
        // * Update BalanceChange
        await BalanceChangeService.updateBalanceChangeStatus(
          work.BalanceChangeId,
          WorkStatus.IN_PROGRESS,
        );
      });
    } else if (workResult.status === ProviderTransferStatus.ERROR) {
      await transactionGuard(async () => {
        await BalanceChangeService.updateBalanceChangeStatus(
          work.BalanceChangeId,
          WorkStatus.ERROR,
        );
        await BalanceService.gmUpdateBalance(work.GamblerId, work.currencyCode);
      });
    }
  },
  async executedWithdrawBankWork(id: number) {
    const work = await WorkRepository.findById(id);
    if (!work) {
      console.log(`*** withdraw bank: ${EC[EC.WORK_DOES_NOT_EXIST]}`);
      return;
    }
    const workResult = work.result as ITransferResult;
    // * Find WithdrawRequest
    const withdrawReq = await WithdrawRequestService.findWithdrawRequestWithBankWorkId(
      work.id,
    );
    if (!withdrawReq) {
      console.log(
        `*** withdraw bank work: ${EC[EC.WITHDRAW_REQUEST_DOES_NOT_EXIST]}`,
      );
      return;
    }
    if (workResult.status === ProviderTransferStatus.SUCCESS) {
      await transactionGuard(async () => {
        // * Update BalanceChange
        await BalanceChangeService.updateBalanceChangeStatus(
          work.BalanceChangeId,
          WorkStatus.SUCCESS,
        );
        // * Update WithdrawRequest
        withdrawReq.status = WithdrawRequestStatus.SUCCESS;
        withdrawReq.afterBalance = withdrawReq.beforeBalance.minus(
          withdrawReq.amount,
        );
        await withdrawReq.save();
      });
    } else if (workResult.status === ProviderTransferStatus.ERROR) {
      await transactionGuard(async () => {
        await BalanceChangeService.updateBalanceChangeStatus(
          work.BalanceChangeId,
          WorkStatus.ERROR,
        );
        withdrawReq.status = WithdrawRequestStatus.FAILED;
        await withdrawReq.save();
      });
    }
  },
  async executedReportBankWork(id: number) {
    const work = await WorkRepository.findById(id);
    if (!work) {
      console.log(`*** withdraw bank: ${EC[EC.WORK_DOES_NOT_EXIST]}`);
      return;
    }
    const {
      statementDate,
      NomineeBankAccountId,
    } = work.detail as IDetailTxReportWork;
    const txReport = await TxReportRepository.findOneWithCondition({
      where: { statementDate, NomineeBankAccountId: NomineeBankAccountId! },
    });
    if (!txReport) {
      console.log(`*** withdraw bank: ${EC[EC.TX_REPORT_DOES_NOT_EXIST]}`);
      return;
    }
    await transactionGuard(async () => {
      txReport.completed = true;
      work.executed = true;
      work.executedTstamp = new Date();
      await txReport.save();
      await work.save();
    });
  },
  async executedRefreshBalanceWork(id: number) {
    const work = await WorkRepository.findById(id);
    if (!work) {
      console.log(`*** refresh balance: ${EC[EC.WORK_DOES_NOT_EXIST]}`);
      return;
    }
    const {
      accountNo,
      bankCode,
    } = work.detail as INomineeBankAccountRefreshDetailWork;
    const {
      balance,
      updatedTstamp,
    } = work.result as INomineeBankAccountRefreshBalanceReport;
    const nomineeBankAccounts = await NomineeBankAccountRepository.findAllNomineeByBankAccount(
      { accountNo, bankCode },
    );
    await transactionGuard(async () => {
      for (const nomineeBa of nomineeBankAccounts) {
        if (
          moment(nomineeBa.lastBalanceUpdate).isAfter(moment(updatedTstamp))
        ) {
          continue;
        }
        nomineeBa.lastBalance = new BigNumber(balance);
        nomineeBa.lastBalanceUpdate = moment(updatedTstamp).toDate();
        await nomineeBa.save();
      }
      work.executed = true;
      work.executedTstamp = new Date();
      await work.save();
    });
  },
};
