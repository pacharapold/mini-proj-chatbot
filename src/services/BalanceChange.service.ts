import { AccountType } from '@common/enum/AccountType.enum';
import { TxType } from '@common/enum/TxType.enum';
import { WorkStatus } from '@common/enum/WorkStatus.enum';
import { EC, Invalid } from '@common/error/Invalid.error';
import BalanceRepository from '@common/repository/Balance.repository';
import BankMsgRepository from '@common/repository/BankMsg.repository';
import NomineeBankAccountRepository from '@common/repository/NomineeBankAccount.repository';
import ProviderAccountRepository from '@common/repository/ProviderAccount.repository';
import BalanceServiceCommon from '@common/service/Balance.service';
import ProviderAccountService from '@common/service/ProviderAccount.service';
import SiteConfigService from '@common/service/SiteConfig.service';
import {
  IBalanceChangeCreate,
  IBalanceChangeDeposit,
  IBalanceChangeWithdraw,
  IBalanceChangeWithdrawDetail,
} from '@common/type/BalanceChange.interface';
import { BalanceChange } from '@common/type/BalanceChange.model';
import { BANKS } from '@common/type/Bank.interface';
import { Gambler } from '@common/type/Gambler.model';
import { transactionGuard } from '@midas-soft/midas-common';
import GamblerBankAccountService from '@service/GamblerBankAccount.service';
import WorkService from '@service/Work.service';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { Op } from 'sequelize';

export default {
  async changeBalance(data: IBalanceChangeCreate) {
    const {
      type,
      GamblerId,
      amountChange,
      currencyCode,
      detail,
      tstamp,
      status,
    }: IBalanceChangeCreate = data;
    let balance =
      (await BalanceRepository.findBalance(GamblerId, currencyCode)) ??
      (await BalanceServiceCommon.initBalance(GamblerId));

    const amountBefore = balance.amount;
    const amountAfter = balance.amount.plus(amountChange);
    balance.amount = amountAfter;
    balance.lastBalanceUpdate = new Date();
    balance = await balance.save();

    const balanceChange = await BalanceChange.create({
      GamblerId,
      type,
      amountBefore,
      amountAfter,
      tstamp,
      currencyCode,
      status,
      amount: amountChange,
      details: detail,
    });

    return { result: { balance, balanceChange } };
  },
  async getWithdrawCountByGmId(GamblerId: number) {
    return await BalanceChange.count({
      where: {
        GamblerId,
        type: TxType.WITHDRAW,
        tstamp: {
          [Op.gte]: moment(new Date()).startOf('day'),
          [Op.lte]: moment(new Date()).endOf('day'),
        },
      },
    });
  },
  async getWithdrawByGmId(GamblerId: number) {
    return await BalanceChange.findAll({
      where: {
        GamblerId,
        type: TxType.WITHDRAW,
        tstamp: {
          [Op.gte]: moment(new Date()).startOf('day'),
          [Op.lte]: moment(new Date()).endOf('day'),
        },
      },
    });
  },
  async getBalanceChangeByGmId(GamblerId: number, type: TxType[]) {
    let typeCondition = {};
    if (type.length > 0) {
      typeCondition = { type: { [Op.in]: type } };
    }
    return await BalanceChange.findAll({
      where: {
        GamblerId,
        ...typeCondition,
      },
      order: [['tstamp', 'DESC']],
    });
  },
  async createBalanceChange(data: IBalanceChangeCreate) {
    const {
      GamblerId,
      amountChange,
      detail,
      type,
      tstamp,
      currencyCode,
      status,
    }: IBalanceChangeCreate = data;
    const balance =
      (await BalanceRepository.findBalance(GamblerId, currencyCode)) ??
      (await BalanceServiceCommon.initBalance(GamblerId));

    const amountBefore = balance.amount;

    // if amountChange > amount, then amountChange = amount and amountAfter will be 0
    const validAmountChange = amountChange.plus(amountBefore).isNegative()
      ? amountBefore.negated()
      : amountChange;

    const amountAfter = balance.amount.plus(validAmountChange);
    const balanceChange = await BalanceChange.create({
      GamblerId,
      type,
      amountBefore,
      amountAfter,
      tstamp,
      currencyCode,
      status,
      amount: validAmountChange,
      details: detail,
    });

    return { balanceChange };
  },
  async deposit({
    fromAccountNo,
    fromBankCode,
    NomineeBankAccountId,
    BankMsgId,
    amount,
  }: IBalanceChangeDeposit) {
    const SERVICE: string = `*** DEPOSIT`;
    const bankMsg = await BankMsgRepository.findById(BankMsgId);
    if (!bankMsg) {
      console.log(`*** DEPOSIT: ${EC[EC.BANK_MSG_DOES_NOT_EXIST]}`);
      return;
    }

    const nomineeBankAcct = await NomineeBankAccountRepository.findNomineeBankAccountById(
      NomineeBankAccountId,
    );
    if (!nomineeBankAcct) {
      console.log(`${SERVICE}: ${EC[EC.NOMINEE_BANK_ACCOUNT_DOES_NOT_EXIST]}`);
      return;
    }

    // * Dynamic Variable
    // let hiddenDestAcctNo: string = '';
    let hiddenSrcAcctNo: string = '';
    if (nomineeBankAcct.bankCode === BANKS.KBANK.code) {
      // * KBANK ( as destination bank code )
      hiddenSrcAcctNo = fromAccountNo.replace(/X/g, '%');
    } else if (nomineeBankAcct.bankCode === BANKS.SCB.code) {
      // * SCB ( as destination bank code )
      hiddenSrcAcctNo = fromAccountNo.replace(/x/g, '%');
    }

    // * Find GamblerBankAccount
    const gmBankAcct = await GamblerBankAccountService.findGmBankAcctByHiddenAccountNo(
      hiddenSrcAcctNo,
      fromBankCode,
    );
    if (!gmBankAcct) {
      console.log(`${SERVICE}: ${EC[EC.GAMBLER_BANK_ACCOUNT_DOES_NOT_EXIST]}`);
      return;
    }
    if (!gmBankAcct.autoDeposit) {
      console.log(
        `${SERVICE}: ${EC[EC.GAMBLER_BANK_ACCOUNT_DISABLE_AUTO_DEPOSIT]}`,
      );
      return;
    }
    const siteConfig = await SiteConfigService.getSiteConfig(
      gmBankAcct.Gambler.site,
    );
    const minDepositVal = new BigNumber(siteConfig.minimumDepositAmount);
    const depositAmount = new BigNumber(amount);
    // * Valid Amount
    if (depositAmount.isLessThan(minDepositVal)) {
      console.log(`${SERVICE}: ${EC[EC.MINIMUM_DEPOSIT_AMOUNT]}`);
      return;
    }

    // * Gambler deposit to wrong nomineeBankAccount
    // TODO: Another Condition for bank
    if (fromBankCode === BANKS.KBANK.code) {
      if (nomineeBankAcct.bankCode !== BANKS.KBANK.code) {
        console.log(
          `${SERVICE}: ${
            EC[EC.GAMBLER_CANNOT_DEPOSIT_TO_OTHER_NOMINEE_BANK_ACCOUNT]
          }`,
        );
        return;
      }
    }
    // * NomineeBankAccount ( valid )
    if (nomineeBankAcct.type !== AccountType.DEPOSIT) {
      console.log(`${SERVICE}: ${EC[EC.NOMINEE_BANK_ACCOUNT_NOT_FOR_DEPOSIT]}`);
      return;
    }
    if (nomineeBankAcct.sequence !== gmBankAcct.sequence) {
      console.log(
        `${SERVICE}: ${EC[EC.NOMINEE_BANK_ACCOUNT_MISMATCH_SEQUENCE]}`,
      );
      return;
    }
    if (!nomineeBankAcct.auto) {
      console.log(
        `${SERVICE}: ${EC[EC.NOMINEE_BANK_ACCOUNT_DISABLE_AUTO_DEPOSIT]}`,
      );
      return;
    }

    // * Find ProviderAccount
    const providerAcct = await ProviderAccountRepository.findByGamblerId(
      gmBankAcct.GamblerId,
    );

    await transactionGuard(async () => {
      // * Update GamblerBankAccount Status
      if (!gmBankAcct.active) {
        gmBankAcct.active = true;
        await gmBankAcct.save();
      }
      // * Change Balance
      const newBalance = await this.createBalanceChange({
        GamblerId: gmBankAcct.GamblerId,
        amountChange: depositAmount,
        currencyCode: 'THB',
        type: TxType.DEPOSIT,
        tstamp: new Date(),
        status: WorkStatus.TRANSFER_TO_IMI,
        detail: {
          amount: depositAmount,
          destinationAccountNo: nomineeBankAcct.accountNo,
          sourceAccountNo: fromAccountNo,
          destinationBankCode: nomineeBankAcct.bankCode,
          sourceBankCode: fromBankCode,
        },
      });
      // * Execute SMS
      bankMsg.executed = true;
      bankMsg.BalanceChangeId = newBalance.balanceChange.id;
      await bankMsg!.save();
      // * Create Work
      const work = await WorkService.createWorkImiwin({
        type: TxType.DEPOSIT,
        currencyCode: 'THB',
        BalanceChangeId: newBalance.balanceChange.id,
        GamblerId: gmBankAcct.GamblerId,
        agentUserName: providerAcct!.agentUserName,
        detail: {
          amount: depositAmount,
          currencyCode: 'THB',
          providerCode: 'IMIWIN',
          username: providerAcct!.username,
        },
      });
      // * Update ProfileUi
      await BalanceServiceCommon.needUpdateProfileUi(
        gmBankAcct.GamblerId,
        work.currencyCode,
      );
    });
  },
  async withdraw(data: IBalanceChangeWithdraw) {
    const { GamblerId, amount, currencyCode }: IBalanceChangeWithdraw = data;
    // * Find Gambler Bank Account
    const gmBankAcct = await GamblerBankAccountService.findByGmId(GamblerId);
    if (!gmBankAcct) {
      throw Invalid.badRequest(EC.GAMBLER_BANK_ACCOUNT_DOES_NOT_EXIST);
    }
    // * Find ProviderAccount
    const providerAcct = await ProviderAccountRepository.findByGamblerId(
      GamblerId,
    );
    if (!providerAcct) {
      throw Invalid.badRequest(EC.PROVIDER_ACCOUNT_DOES_NOT_EXIST);
    }
    const bcDetail: IBalanceChangeWithdrawDetail = {
      amount,
      destinationBankCode: gmBankAcct.bankCode,
      destinationAccountNo: gmBankAcct.accountNo,
      destinationAccountName: gmBankAcct.accountName,
      username: providerAcct.username,
    };
    // * Create BalanceChange
    await transactionGuard(async () => {
      // * Change Balance
      const newBalance = await this.createBalanceChange({
        currencyCode,
        GamblerId: gmBankAcct.GamblerId,
        amountChange: amount.negated(),
        tstamp: new Date(),
        type: TxType.WITHDRAW,
        status: WorkStatus.TRANSFER_FROM_IMI,
        detail: bcDetail,
      });
      // * Create Withdraw Work
      const work = await WorkService.createWorkImiwin({
        type: TxType.WITHDRAW,
        currencyCode: 'THB',
        BalanceChangeId: newBalance.balanceChange.id,
        GamblerId: gmBankAcct.GamblerId,
        agentUserName: providerAcct.agentUserName,
        detail: {
          amount,
          currencyCode: 'THB',
          providerCode: 'IMIWIN',
          username: providerAcct!.username,
        },
      });
      return { newBalance };
    });
  },
  async updateBalanceChangeStatus(id: number, status: WorkStatus) {
    const bac = await BalanceChange.findByPk(id);
    if (!bac) throw Invalid.badRequest(EC.BALANCE_CHANGE_DOES_NOT_EXIST);
    bac.status = status;
    await bac.save();
    return bac;
  },
  async findWithCondition(condition: any) {
    return await BalanceChange.findOne({
      where: { ...condition },
      include: [{ model: Gambler }],
    });
  },
  async getInCompleteBalanceChange(GamblerId: number, type: TxType) {
    const inCompleteStatus = [
      WorkStatus.TRANSFER_TO_IMI,
      WorkStatus.TRANSFER_FROM_IMI,
      WorkStatus.TRANSFER_FROM_BANK,
      WorkStatus.IN_PROGRESS,
    ];
    return await BalanceChange.findOne({
      where: {
        GamblerId,
        type,
        status: { [Op.in]: inCompleteStatus },
      },
    });
  },
};
