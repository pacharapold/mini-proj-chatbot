import { ActionRequestType } from '@common/enum/ActionRequestType.enum';
import { DepositFromType } from '@common/enum/DepositFromType.enum';
import { TxType } from '@common/enum/TxType.enum';
import { WithdrawRequestAction } from '@common/enum/WithdrawRequestAction.enum';
import { WithdrawRequestStatus } from '@common/enum/WithdrawRequestStatus.enum';
import { WorkStatus } from '@common/enum/WorkStatus.enum';
import { EC } from '@common/error/Invalid.error';
import BalanceChangeRepository from '@common/repository/BalanceChange.repository';
import BankMsgRepository from '@common/repository/BankMsg.repository';
import GamblerRepository from '@common/repository/Gambler.repository';
import GamblerBankAccountRepository from '@common/repository/GamblerBankAccount.repository';
import NomineeBankAccountRepository from '@common/repository/NomineeBankAccount.repository';
import ProviderAccountRepository from '@common/repository/ProviderAccount.repository';
import SmsRepository from '@common/repository/Sms.repository';
import WithdrawRequestRepository from '@common/repository/WithdrawRequest.repository';
import WorkRepository from '@common/repository/Work.repository';
import BalanceService from '@common/service/Balance.service';
import BalanceChangeServiceCommon from '@common/service/BalanceChange.service';
import NomineeBankAccountService from '@common/service/NomineeBankAccount.service';
import ProviderAccountService from '@common/service/ProviderAccount.service';
import WorkService from '@common/service/Work.service';
import {
  IActionRequestChangeCredit,
  IActionRequestChangeWithdrawRequestCancel,
  IActionRequestDetailDeposit,
  IActionRequestTrueWalletDetail,
  IActionRequestWithdraw,
} from '@common/type/ActionRequest.interface';
import { ActionRequest } from '@common/type/ActionRequest.model';
import {
  IBalanceChangeActionRequest,
  IBalanceChangeActionRequestChangeCredit,
  IBalanceChangeWithdrawDetail,
} from '@common/type/BalanceChange.interface';
import { BankMsg } from '@common/type/BankMsg.model';
import { Sms } from '@common/type/Sms.model';
import { Work } from '@common/type/Work.model';
import { sleep } from '@common/util/common';
import { transactionGuard } from '@midas-soft/midas-common';
import WithdrawRequestService from '@service/WithdrawRequest.service';
import BigNumber from 'bignumber.js';
import { Op } from 'sequelize';

export default {
  async executedActionRequest() {
    while (true) {
      // * Find Approved Action Request
      const requests = await ActionRequest.findAll({
        where: { executed: false, approverId: { [Op.ne]: null } },
      });

      // * Executed Approved Action Request
      const specialType = [ActionRequestType.CANCEL_WITHDRAW];
      for (const request of requests) {
        if (!request.approved && !specialType.includes(request.type)) {
          request.result = EC[EC.ACTION_REQUEST_NOT_APPROVE];
          request.executed = true;
          await request.save();
          continue;
        }
        // * Find Gambler
        const gm = await GamblerRepository.findById(request.GamblerId);
        if (!gm) {
          request.result = EC[EC.GAMBLER_DOES_NOT_EXIST];
          continue;
        }
        // * Type Operation
        if (request.type === ActionRequestType.DEPOSIT) {
          await this.executedActionRequestDeposit(request.id);
        } else if (request.type === ActionRequestType.WITHDRAW) {
          await this.executedActionRequestWithdraw(request.id);
        } else if (request.type === ActionRequestType.TOPUP_CREDIT) {
          await this.executedActionRequestTopUpCredit(request.id);
        } else if (request.type === ActionRequestType.REDUCE_CREDIT) {
          await this.executedActionRequestReduceCredit(request.id);
        } else if (request.type === ActionRequestType.OTHER) {
          // TODO OTHER
          console.log(`Other`);
        } else if (request.type === ActionRequestType.CANCEL_WITHDRAW) {
          await this.executedActionRequestCancelWithdrawaRequest(request.id);
        } else if (request.type === ActionRequestType.DEPOSIT_TRUE_WALLET) {
          await this.executedActionRequestTrueWalletRequest(request.id);
        }
        request.executed = true;
        await request.save();
      }
      // * Sleep Times
      await sleep(1000);
    }
  },
  async executedActionRequestWithdraw(id: number) {
    const request = await ActionRequest.findByPk(id);
    if (!request) {
      console.log(
        `*** Action Request (W): ${EC[EC.ACTION_REQUEST_DOES_NOT_EXIST]}`,
      );
      return;
    }
    const reqDetailW = request.detail as IActionRequestWithdraw;
    // * Change BalanceChange Status && Detail
    const bac = await BalanceChangeRepository.findById(
      reqDetailW.BalanceChangeId,
    );
    if (!bac) {
      request.result = EC[EC.BALANCE_CHANGE_DOES_NOT_EXIST];
      request.executed = true;
      return await request.save();
    }
    const bacDetail = bac.details as IBalanceChangeWithdrawDetail;
    // * Validate Part
    if (
      !new BigNumber(bac.amount)
        .abs()
        .isEqualTo(new BigNumber(reqDetailW.amount).abs())
    ) {
      request.result = EC[EC.AMOUNT_MISMATCH];
      request.executed = true;
      return await request.save();
    }
    if (
      bacDetail.destinationAccountNo !== reqDetailW.accountNo ||
      bacDetail.destinationBankCode !== reqDetailW.bankCode
    ) {
      request.result = EC[EC.GAMBLER_BANK_ACCOUNT_MISMATCH];
      request.executed = true;
      return await request.save();
    }
    await transactionGuard(async () => {
      bac.status = WorkStatus.SUCCESS;
      bac.details = { ...bac.details, actionRequestDetail: reqDetailW };
      await bac.save();
      // * Completed && EXECUTED Work WITHDRAW && WITHDRAW_BANK
      const works = await WorkService.findAllByBalanceChangeId(
        reqDetailW.BalanceChangeId,
      );
      const tstamp = new Date();
      for (const wk of works) {
        wk.completed = true;
        wk.completedTstamp = tstamp;
        wk.executed = true;
        wk.executedTstamp = tstamp;
        await wk.save();
      }
      // * Update Request ( BalanceChangeId && Executed )
      request.BalanceChangeId = bac.id;
      request.executed = true;
      await BalanceService.needUpdateProfileUi(bac.GamblerId, bac.currencyCode);
      await request.save();
    });

    if (!request.executed) {
      request.executed = true;
      await request.save();
    }
  },
  async executedActionRequestDeposit(id: number) {
    const request = await ActionRequest.findByPk(id);
    if (!request) {
      console.log(
        `*** Action Request (D): ${EC[EC.ACTION_REQUEST_DOES_NOT_EXIST]}`,
      );
      return;
    }
    const reqDetailD = request.detail as IActionRequestDetailDeposit;
    // * Find ProviderAccount
    let providerAcct = await ProviderAccountRepository.findByGamblerId(
      request.GamblerId,
    );
    // * Find GamblerBankAccount
    const gmBankAcct = await GamblerBankAccountRepository.findByBankAccount({
      bankCode: reqDetailD.bankCode,
      accountNo: reqDetailD.accountNo,
    });
    // * Find Source
    let focusSource: Sms | BankMsg | null;
    if (reqDetailD.source) {
      if (reqDetailD.source === DepositFromType.SMS) {
        const tmpSms = await SmsRepository.findById(reqDetailD.sourceId!);
        if (!tmpSms) {
          request.result = EC[EC.SMS_DOES_NOT_EXIST];
          request.executed = true;
          await request.save();
          return;
        }
        focusSource = tmpSms;
      }
      if (reqDetailD.source === DepositFromType.TX) {
        const tmpBankMsg = await BankMsgRepository.findById(
          reqDetailD.sourceId!,
        );
        if (!tmpBankMsg) {
          request.result = EC[EC.BANK_MSG_DOES_NOT_EXIST];
          request.executed = true;
          await request.save();
          return;
        }
        focusSource = tmpBankMsg;
      }
    }
    await transactionGuard(async () => {
      // * Assign Provider to Gambler
      // * Update Active GamblerBankAccount
      if (gmBankAcct && !gmBankAcct.active) {
        gmBankAcct.active = true;
        await gmBankAcct.save();
      }
      // * Change Balance
      const baDetail: IBalanceChangeActionRequest = {
        ActionRequestId: request.id,
        sourceAccountNo: reqDetailD.accountNo,
        sourceBankCode: reqDetailD.bankCode,
        amount: reqDetailD.amount,
        transferTstamp: reqDetailD.transferTstamp,
      };
      if (focusSource) {
        baDetail.source = reqDetailD.source;
        baDetail.sourceId = reqDetailD.sourceId;
      }
      const depositAmount = new BigNumber(reqDetailD.amount);
      const newBalance = await BalanceChangeServiceCommon.createBalanceChange({
        GamblerId: request.GamblerId,
        amountChange: depositAmount,
        currencyCode: 'THB',
        type: TxType.DEPOSIT,
        tstamp: new Date(),
        status: WorkStatus.TRANSFER_TO_IMI,
        detail: baDetail,
      });
      // * Create Work
      const work = await WorkService.createWorkImiwin({
        type: TxType.DEPOSIT,
        currencyCode: 'THB',
        BalanceChangeId: newBalance.balanceChange.id,
        GamblerId: request.GamblerId,
        agentUserName: providerAcct!.agentUserName,
        detail: {
          amount: depositAmount,
          currencyCode: 'THB',
          providerCode: 'IMIWIN',
          username: providerAcct!.username,
        },
      });
      // * Update Action Request BalanceChange
      request.BalanceChangeId = newBalance.balanceChange.id;
      request.executed = true;
      await request.save();
      // * Execute Source
      if (focusSource) {
        if (reqDetailD.source === DepositFromType.SMS) {
          focusSource.executed = true;
          await focusSource.save();
        }
        if (reqDetailD.source === DepositFromType.TX) {
          await focusSource.update({
            BalanceChangeId: newBalance.balanceChange.id,
            executed: true,
          });
        }
      }
      // * Update ProfileUi
      await BalanceService.needUpdateProfileUi(request.GamblerId, 'THB');
    });
  },
  async executedActionRequestTopUpCredit(id: number) {
    const request = await ActionRequest.findByPk(id);
    if (!request) {
      console.log(
        `*** Action Request (Top-up credit): ${
          EC[EC.ACTION_REQUEST_DOES_NOT_EXIST]
        }`,
      );
      return;
    }
    const reqDetailD = request.detail as IActionRequestChangeCredit;

    // * Find ProviderAccount
    let providerAcct = await ProviderAccountRepository.findByGamblerId(
      request.GamblerId,
    );

    await transactionGuard(async () => {
      // * Assign Provider to Gambler

      // * Change Balance
      const baDetail: IBalanceChangeActionRequestChangeCredit = {
        ActionRequestId: request.id,
        amount: reqDetailD.amount,
      };
      const depositAmount = new BigNumber(reqDetailD.amount);
      const newBalance = await BalanceChangeServiceCommon.createBalanceChange({
        GamblerId: request.GamblerId,
        amountChange: depositAmount,
        currencyCode: 'THB',
        type: TxType.DEPOSIT,
        tstamp: new Date(),
        status: WorkStatus.TRANSFER_TO_IMI,
        detail: baDetail,
      });

      // * Create Work
      const work = await WorkService.createWorkImiwin({
        type: TxType.DEPOSIT,
        currencyCode: 'THB',
        BalanceChangeId: newBalance.balanceChange.id,
        GamblerId: request.GamblerId,
        agentUserName: providerAcct!.agentUserName,
        detail: {
          amount: depositAmount,
          currencyCode: 'THB',
          providerCode: 'IMIWIN',
          username: providerAcct!.username,
        },
      });

      // * Update Action Request BalanceChange
      request.BalanceChangeId = newBalance.balanceChange.id;
      request.executed = true;
      await request.save();

      // * Update ProfileUi
      await BalanceService.needUpdateProfileUi(request.GamblerId, 'THB');
    });
  },
  async executedActionRequestReduceCredit(id: number) {
    const request = await ActionRequest.findByPk(id);
    if (!request) {
      console.log(
        `*** Action Request (Reduce credit): ${
          EC[EC.ACTION_REQUEST_DOES_NOT_EXIST]
        }`,
      );
      return;
    }
    // Validate Provider Account
    const providerAcct = await ProviderAccountRepository.findByGamblerId(
      request.GamblerId,
    );
    if (!providerAcct) {
      request.result = EC[EC.PROVIDER_ACCOUNT_DOES_NOT_EXIST];
      request.executed = true;
      return await request.save();
    }

    const reqDetail = request.detail as IActionRequestChangeCredit;
    const bacDetail: IBalanceChangeActionRequestChangeCredit = {
      ActionRequestId: request.id,
      amount: reqDetail.amount,
    };

    await transactionGuard(async () => {
      // Create new Balance Change to reduce amount
      const bac = await BalanceChangeServiceCommon.createBalanceChange({
        currencyCode: 'THB',
        GamblerId: request.GamblerId,
        amountChange: new BigNumber(reqDetail.amount).negated(),
        tstamp: new Date(),
        type: TxType.WITHDRAW,
        status: WorkStatus.TRANSFER_FROM_IMI,
        detail: bacDetail,
      });

      // Create work to reduce credit from IMI
      await WorkService.createWorkImiwin({
        type: TxType.REDUCE_CREDIT,
        currencyCode: 'THB',
        BalanceChangeId: bac.balanceChange.id,
        GamblerId: request.GamblerId,
        agentUserName: providerAcct!.agentUserName,
        detail: {
          amount: bac.balanceChange.amount.abs(),
          currencyCode: 'THB',
          providerCode: 'IMIWIN',
          username: providerAcct!.username,
        },
      });

      // * Update Request ( BalanceChangeId && Executed )
      request.BalanceChangeId = bac.balanceChange.id;
      request.executed = true;
      await BalanceService.needUpdateProfileUi(
        request.GamblerId,
        bac.balanceChange.currencyCode,
      );
      await request.save();
    });
  },
  async executedActionRequestCancelWithdrawaRequest(id: number) {
    const request = await ActionRequest.findByPk(id);
    if (!request) {
      console.log(
        `*** Action Request (Cancel WithdrawRequest): ${
          EC[EC.ACTION_REQUEST_DOES_NOT_EXIST]
        }`,
      );
      return;
    }
    const reqDetail = request.detail as IActionRequestChangeWithdrawRequestCancel;
    const withdrawRequest = await WithdrawRequestRepository.findById(
      reqDetail.WithdrawRequestId,
    );
    if (!withdrawRequest) {
      const error = EC.WITHDRAW_REQUEST_ACTION_DOES_NOT_EXIST;
      console.log(`*** Action Request (Cancel): ${EC[error]}`);
      request.result = EC[error];
      request.executed = true;
      return await request.save();
    }
    let bankWork: Work | null = null;
    if (withdrawRequest.approveStatus === WithdrawRequestAction.AUTO) {
      bankWork = await WorkRepository.findById(withdrawRequest.workBankId);
      if (!bankWork) {
        const error = EC.WORK_DOES_NOT_EXIST;
        console.log(`*** Action Request (Cancel-Reject): ${EC[error]}`);
        request.result = EC[error];
        request.executed = true;
        return await request.save();
      }
    }
    // * Reject ( continue auto withdraw )
    if (!request.approved) {
      // * Reset Work
      await transactionGuard(async () => {
        withdrawRequest.status = WithdrawRequestStatus.WITHDRAWING;
        request.executed = true;
        if (bankWork) {
          bankWork.completed = false;
          await bankWork.save();
        }
        await withdrawRequest.save();
        await request.save();
      });
    } else {
      // * Approve ( cancel auto withdraw )
      const reject = await WithdrawRequestService.executedRejectWithdrawRequest(
        withdrawRequest.id,
      );
      await transactionGuard(async () => {
        if (bankWork) {
          bankWork.completed = true;
          bankWork.executed = true;
          bankWork.executedTstamp = new Date();
          await bankWork.save();
        }
        request.BalanceChangeId = reject?.newBalance.balanceChange.id;
        request.executed = true;
        await request.save();
      });
    }
  },
  async executedActionRequestTrueWalletRequest(id: number) {
    const request = await ActionRequest.findByPk(id);
    if (!request) {
      console.log(
        `*** Action Request (True-Wallet deposit): ${
          EC[EC.ACTION_REQUEST_DOES_NOT_EXIST]
        }`,
      );
      return;
    }
    const reqDetailD = request.detail as IActionRequestTrueWalletDetail;

    // * Find ProviderAccount
    let providerAcct = await ProviderAccountRepository.findByGamblerId(
      request.GamblerId,
    );
    // * Find GamblerBankAccount
    const gmBankAcct = await GamblerBankAccountRepository.findByGamblerId(
      request.GamblerId,
    );
    if (!gmBankAcct) {
      console.log(
        `*** Action Request (True-Wallet deposit): ${
          EC[EC.GAMBLER_BANK_ACCOUNT_DOES_NOT_EXIST]
        }`,
      );
      return;
    }
    // * Find NomineeBankAccount (True Wallet)
    const nomineeBankAccount = await NomineeBankAccountRepository.findNomineeBankAccountById(
      reqDetailD.NomineeBankAccountId,
    );
    if (!nomineeBankAccount) {
      console.log(
        `*** Action Request (True-Wallet deposit): ${
          EC[EC.NOMINEE_BANK_ACCOUNT_DOES_NOT_EXIST]
        }`,
      );
      return;
    }

    await transactionGuard(async () => {
      // * Assign Provider to Gambler

      // * Change Balance
      const baDetail: IBalanceChangeActionRequestChangeCredit = {
        ActionRequestId: request.id,
        amount: reqDetailD.amount,
      };
      const depositAmount = new BigNumber(reqDetailD.amount);
      const newBalance = await BalanceChangeServiceCommon.createBalanceChange({
        GamblerId: request.GamblerId,
        amountChange: depositAmount,
        currencyCode: 'THB',
        type: TxType.DEPOSIT,
        tstamp: new Date(),
        status: WorkStatus.TRANSFER_TO_IMI,
        detail: baDetail,
      });

      // * Create Work
      const work = await WorkService.createWorkImiwin({
        type: TxType.DEPOSIT,
        currencyCode: 'THB',
        BalanceChangeId: newBalance.balanceChange.id,
        GamblerId: request.GamblerId,
        agentUserName: providerAcct!.agentUserName,
        detail: {
          amount: depositAmount,
          currencyCode: 'THB',
          providerCode: 'IMIWIN',
          username: providerAcct!.username,
        },
      });
      // * Update GamblerBankAccount
      if (!gmBankAcct.active) {
        gmBankAcct.active = true;
        await gmBankAcct.save();
      }

      // * Update NomineeBankAccount (True-Wallet) lastBalance
      await NomineeBankAccountService.updateLastBalanceById({
        id: nomineeBankAccount.id,
        lastBalance: depositAmount.plus(nomineeBankAccount.lastBalance),
        lastBalanceUpdate: request.createdAt,
      });

      // * Update Action Request BalanceChange
      request.BalanceChangeId = newBalance.balanceChange.id;
      request.executed = true;
      await request.save();

      // * Update ProfileUi
      await BalanceService.needUpdateProfileUi(request.GamblerId, 'THB');
    });
  },
};
