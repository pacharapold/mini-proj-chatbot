import { TxType } from '@common/enum/TxType.enum';
import { WithdrawRequestAction } from '@common/enum/WithdrawRequestAction.enum';
import { WithdrawRequestStatus } from '@common/enum/WithdrawRequestStatus.enum';
import { WorkStatus } from '@common/enum/WorkStatus.enum';
import { EC } from '@common/error/Invalid.error';
import BalanceChangeRepository from '@common/repository/BalanceChange.repository';
import GamblerBankAccountRepository from '@common/repository/GamblerBankAccount.repository';
import ProviderAccountRepository from '@common/repository/ProviderAccount.repository';
import WithdrawRequestRepository from '@common/repository/WithdrawRequest.repository';
import WorkRepository from '@common/repository/Work.repository';
import BalanceService from '@common/service/Balance.service';
import { IBalanceChangeWithdrawDetail } from '@common/type/BalanceChange.interface';
import { BANKS } from '@common/type/Bank.interface';
import { IWithdrawRequestCreate } from '@common/type/WithdrawRequest.interface';
import { WithdrawRequest } from '@common/type/WithdrawRequest.model';
import { ITransferResult } from '@common/type/Work.Provider.interface';
import { sleep } from '@common/util/common';
import { transactionGuard } from '@midas-soft/midas-common';
import BalanceChangeService from '@service/BalanceChange.service';
import NomineeBankAccountService from '@service/NomineeBankAccount.service';
import WorkService from '@service/Work.service';
import BigNumber from 'bignumber.js';
import { Op } from 'sequelize';

const SERVICE = `*** WithdrawRequest`;

export default {
  async createWithdrawRequest({
    GamblerBankAccountId,
    workImiId,
    amount,
    detail,
    status,
    tstamp,
    approveStatus,
    approverId,
    reserve,
    reserveOperatorId,
    reserveTstamp,
  }: IWithdrawRequestCreate) {
    // * Find GamblerBankAccount
    const gmBankAccount = await GamblerBankAccountRepository.findById(
      GamblerBankAccountId,
    );
    if (!gmBankAccount) {
      console.log(`${SERVICE}: ${EC[EC.GAMBLER_BANK_ACCOUNT_DOES_NOT_EXIST]}`);
      return;
    }
    // * Find Work ( imiwin withdraw )
    const workImiwin = await WorkRepository.findById(workImiId);
    if (!workImiwin) {
      console.log(`${SERVICE}: ${EC[EC.WORK_DOES_NOT_EXIST]}`);
      return;
    }
    return await WithdrawRequest.create({
      approveStatus,
      status,
      tstamp,
      amount,
      detail,
      approverId,
      reserve,
      reserveOperatorId,
      reserveTstamp,
      afterBalance: new BigNumber(0),
      beforeBalance: new BigNumber(0),
      GamblerBankAccountId: gmBankAccount.id,
      workImiId: workImiwin.id,
    });
  },
  async executedWithdrawRequest() {
    while (true) {
      const withdrawRequests = await WithdrawRequest.findAll({
        where: {
          executed: false,
          approveStatus: {
            [Op.in]: [
              WithdrawRequestAction.AUTO,
              WithdrawRequestAction.REJECT,
              WithdrawRequestAction.MANUAL,
            ],
          },
        },
      });

      for (const withdrawReq of withdrawRequests) {
        switch (withdrawReq.approveStatus) {
          case WithdrawRequestAction.REJECT:
            await this.executedRejectWithdrawRequest(withdrawReq.id);
            break;
          case WithdrawRequestAction.AUTO:
            await this.executedAutoWithdrawRequest(withdrawReq.id);
            break;
          case WithdrawRequestAction.MANUAL:
            await this.executedManualWithdrawRequest(withdrawReq.id);
            break;
        }
      }
      // * Sleep Time
      await sleep(1000);
    }
  },
  async executedRejectWithdrawRequest(id: number) {
    const withdrawRequest = await WithdrawRequestRepository.findById(id);
    if (!withdrawRequest) {
      console.log(`${SERVICE}: ${EC[EC.WITHDRAW_REQUEST_DOES_NOT_EXIST]}`);
      return null;
    }
    const gmBankAcct = await GamblerBankAccountRepository.findById(
      withdrawRequest.GamblerBankAccountId,
    );
    if (!gmBankAcct) {
      console.log(`${SERVICE}: ${EC[EC.GAMBLER_BANK_ACCOUNT_DOES_NOT_EXIST]}`);
      return null;
    }
    const providerAcct = await ProviderAccountRepository.findByGamblerId(
      gmBankAcct.GamblerId,
    );
    if (!providerAcct) {
      console.log(`${SERVICE}: ${EC[EC.PROVIDER_ACCOUNT_DOES_NOT_EXIST]}`);
      return;
    }
    const imiWithdrawWork = await WorkRepository.findById(
      withdrawRequest.workImiId,
    );
    if (!imiWithdrawWork) {
      console.log(`${SERVICE}: ${EC[EC.WORK_DOES_NOT_EXIST]}`);
      return;
    }
    const imiWithdrawBalanceChange = await BalanceChangeRepository.findById(
      imiWithdrawWork.BalanceChangeId,
    );
    if (!imiWithdrawBalanceChange) {
      console.log(`${SERVICE}: ${EC[EC.BALANCE_CHANGE_DOES_NOT_EXIST]}`);
      return;
    }
    const depositAmount = new BigNumber(withdrawRequest.amount);
    const depositWork = await transactionGuard(async () => {
      // * Create deposit BalanceChange
      const newBalance = await BalanceChangeService.createBalanceChange({
        GamblerId: gmBankAcct.GamblerId,
        amountChange: depositAmount,
        currencyCode: 'THB',
        type: TxType.DEPOSIT_RETURN,
        tstamp: new Date(),
        status: WorkStatus.TRANSFER_TO_IMI,
        detail: { WithdrawRequestId: withdrawRequest.id },
      });
      // * Create imi deposit bank work
      const work = await WorkService.createWorkImiwin({
        type: TxType.DEPOSIT,
        currencyCode: 'THB',
        BalanceChangeId: newBalance.balanceChange.id,
        GamblerId: gmBankAcct.GamblerId,
        agentUserName: providerAcct.agentUserName,
        detail: {
          amount: depositAmount,
          currencyCode: 'THB',
          providerCode: 'IMIWIN',
          username: providerAcct.username,
        },
      });
      // * Update withdraw BalanceChange
      imiWithdrawBalanceChange.status = WorkStatus.CANCELED;
      await imiWithdrawBalanceChange.save();
      // * Update withdrawRequest
      withdrawRequest.detail = {
        ...withdrawRequest.detail,
        imiDepositWorkId: work.id,
      };
      withdrawRequest.afterBalance = new BigNumber(0);
      withdrawRequest.beforeBalance = new BigNumber(0);
      withdrawRequest.executed = true;
      if (withdrawRequest.status === WithdrawRequestStatus.ACTION_REQUEST) {
        withdrawRequest.status = WithdrawRequestStatus.CANCEL;
      }
      await withdrawRequest.save();
      // * Update gambler
      await BalanceService.needUpdateProfileUi(
        gmBankAcct.GamblerId,
        work.currencyCode,
      );
      return { work, newBalance };
    });
    return depositWork;
  },
  async executedAutoWithdrawRequest(id: number) {
    const withdrawRequest = await WithdrawRequestRepository.findById(id);
    if (!withdrawRequest) {
      console.log(`${SERVICE}: ${EC[EC.WITHDRAW_REQUEST_DOES_NOT_EXIST]}`);
      return null;
    }
    const imiWithdrawWork = await WorkRepository.findById(
      withdrawRequest.workImiId,
    );
    if (!imiWithdrawWork) {
      console.log(`${SERVICE}: ${EC[EC.WORK_DOES_NOT_EXIST]}`);
      return;
    }
    const balanceChangeWithdraw = await BalanceChangeRepository.findById(
      imiWithdrawWork.BalanceChangeId,
    );
    if (!balanceChangeWithdraw) {
      console.log(`${SERVICE}: ${EC[EC.BALANCE_CHANGE_DOES_NOT_EXIST]}`);
      return;
    }
    const gmBankAcct = await GamblerBankAccountRepository.findByGamblerId(
      balanceChangeWithdraw.GamblerId,
    );
    if (!gmBankAcct) {
      console.log(`${SERVICE}: ${EC[EC.GAMBLER_BANK_ACCOUNT_DOES_NOT_EXIST]}`);
      return;
    }
    // TODO: find other bank if have multiple withdraw bank later
    const WITHDRAW_BANK = BANKS.KBANK.code;
    const bacWithdrawDetail = balanceChangeWithdraw.details as IBalanceChangeWithdrawDetail;
    const nomineeBankAcct = await NomineeBankAccountService.getActiveWithdrawBankAccount(
      WITHDRAW_BANK,
      withdrawRequest.amount.toNumber(),
    );
    if (!nomineeBankAcct) {
      console.log(`${SERVICE}: ${EC[EC.NOMINEE_BANK_ACCOUNT_DOES_NOT_EXIST]}`);
      return;
    }
    await transactionGuard(async () => {
      // * Create Withdraw NomineeBankAccount
      const resultWork = imiWithdrawWork.result as ITransferResult;
      const workBank = await WorkService.createWorkBank({
        BalanceChangeId: balanceChangeWithdraw.id,
        GamblerId: balanceChangeWithdraw.GamblerId,
        amount: resultWork.transferAmount!,
        currencyCode: imiWithdrawWork.currencyCode,
        NomineeBankAccountId: nomineeBankAcct.id,
      });
      // * Update imiWithdrawBalanceChange
      await BalanceChangeService.updateBalanceChangeStatus(
        balanceChangeWithdraw.id,
        WorkStatus.TRANSFER_FROM_BANK,
      );
      bacWithdrawDetail.sourceAccountNo = nomineeBankAcct.accountNo;
      bacWithdrawDetail.sourceBankCode = nomineeBankAcct.bankCode;
      balanceChangeWithdraw.details = bacWithdrawDetail;
      await balanceChangeWithdraw.save();
      // * Update WithdrawRequest
      withdrawRequest.beforeBalance = new BigNumber(
        nomineeBankAcct.lastBalance,
      );
      withdrawRequest.workBankId = workBank.id;
      withdrawRequest.detail = {
        ...withdrawRequest.detail,
        NomineeBankAccountId: nomineeBankAcct.id,
      };
      withdrawRequest.executed = true;
      await withdrawRequest.save();
      // * Update Gambler
      await BalanceService.needUpdateProfileUi(
        gmBankAcct.GamblerId,
        imiWithdrawWork.currencyCode,
      );
      return { workBank };
    });
  },
  async executedManualWithdrawRequest(id: number) {
    const withdrawRequest = await WithdrawRequestRepository.findById(id);
    if (!withdrawRequest) {
      console.log(`${SERVICE}: ${EC[EC.WITHDRAW_REQUEST_DOES_NOT_EXIST]}`);
      return null;
    }
    if (withdrawRequest.status !== WithdrawRequestStatus.SUCCESS) return;
    const imiWithdrawWork = await WorkRepository.findById(
      withdrawRequest.workImiId,
    );
    if (!imiWithdrawWork) {
      console.log(`${SERVICE}: ${EC[EC.WORK_DOES_NOT_EXIST]}`);
      return;
    }
    const balanceChange = await BalanceChangeRepository.findById(
      imiWithdrawWork.BalanceChangeId,
    );
    if (!balanceChange) {
      console.log(`${SERVICE}: ${EC[EC.BALANCE_CHANGE_DOES_NOT_EXIST]}`);
      return;
    }
    await transactionGuard(async () => {
      // * Update BalanceChange
      balanceChange.status = WorkStatus.SUCCESS;
      balanceChange.details = {
        ...balanceChange.details,
        WithdrawRequestId: withdrawRequest.id,
      };
      await balanceChange.save();
      // * Update WithdrawRequest
      withdrawRequest.executed = true;
      await withdrawRequest.save();
      // * Update Gambler
      await BalanceService.needUpdateProfileUi(
        balanceChange.GamblerId,
        imiWithdrawWork.currencyCode,
      );
    });
  },
  async findWithdrawRequestWithBankWorkId(workBankId: number) {
    return await WithdrawRequest.findOne({ where: { workBankId } });
  },
};
