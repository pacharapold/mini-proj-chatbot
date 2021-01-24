import { TxType } from '@common/enum/TxType.enum';
import NomineeBankAccountService from '@common/service/NomineeBankAccount.service';
import { IBankMsg, IBankMsgCreate } from '@common/type/BankMsg.interface';
import { BankMsg } from '@common/type/BankMsg.model';
import { sleep } from '@common/util/common';
import BalanceChangeService from '@service/BalanceChange.service';
import { Op } from 'sequelize';

export default {
  async createBankMsg({
    SmsId,
    amount,
    type,
    tstamp,
    toBankCode,
    toAccountNo,
    remainingAmount,
    fromBankCode,
    fromAccountNo,
    NomineeBankAccountId,
  }: IBankMsgCreate) {
    return await BankMsg.create({
      amount,
      type,
      tstamp,
      toBankCode,
      toAccountNo,
      remainingAmount,
      fromBankCode,
      fromAccountNo,
      SmsId,
      NomineeBankAccountId,
    });
  },
  async executedDepositFromBankMsg() {
    while (true) {
      // * Find BankMsg Type DEPOSIT that not executed
      const bankMessages = await BankMsg.findAll({
        where: {
          executed: false,
          type: TxType.DEPOSIT,
          amount: { [Op.ne]: null },
          fromBankCode: { [Op.ne]: null },
          fromAccountNo: { [Op.ne]: null },
          toBankCode: { [Op.ne]: null },
          toAccountNo: { [Op.ne]: null },
          NomineeBankAccountId: { [Op.ne]: null },
        },
      });
      for (const bankMsg of bankMessages) {
        const {
          id,
          fromBankCode,
          fromAccountNo,
          amount,
          remainingAmount,
          tstamp,
          NomineeBankAccountId,
        }: IBankMsg = bankMsg;
        // * DEPOSIT PART
        await BalanceChangeService.deposit({
          fromAccountNo,
          fromBankCode,
          NomineeBankAccountId,
          amount,
          BankMsgId: id,
        });
        bankMsg.executed = true;
        await bankMsg.save();
        // * UPDATE NOMINEE BANK ACCOUNT AMOUNT
        if (!remainingAmount) continue;
        await NomineeBankAccountService.updateLastBalanceById({
          id: NomineeBankAccountId,
          lastBalance: remainingAmount,
          lastBalanceUpdate: tstamp,
        });
      }
      // * Sleep Time
      await sleep(1000);
    }
  },
  async executedWithdrawFromBankMsg() {
    while (true) {
      // * Find BankMsg Type WITHDRAW that not executed
      const bankMessages = await BankMsg.findAll({
        where: {
          executed: false,
          type: TxType.WITHDRAW_BANK,
          remainingAmount: { [Op.ne]: null },
          fromBankCode: { [Op.ne]: null },
          fromAccountNo: { [Op.ne]: null },
          tstamp: { [Op.ne]: null },
          NomineeBankAccountId: { [Op.ne]: null },
        },
      });
      for (const bankMsg of bankMessages) {
        const {
          remainingAmount,
          tstamp,
          NomineeBankAccountId,
        }: IBankMsg = bankMsg;
        // * UPDATE NOMINEE BANK ACCOUNT AMOUNT
        await NomineeBankAccountService.updateLastBalanceById({
          id: NomineeBankAccountId,
          lastBalance: remainingAmount,
          lastBalanceUpdate: tstamp,
        });
        // * Find BalanceChange to confirm transaction
        // * Update BankMsg
        bankMsg.executed = true;
        await bankMsg.save();
      }
      // * Sleep Time
      await sleep(1000);
    }
  },
};
