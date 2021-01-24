import { AccountType } from '@common/enum/AccountType.enum';
import { Role } from '@common/enum/Role.enum';
import { TxType } from '@common/enum/TxType.enum';
import { EC } from '@common/error/Invalid.error';
import NomineeBankAccountRepository from '@common/repository/NomineeBankAccount.repository';
import { BankMsg } from '@common/type/BankMsg.model';
import { DetailTxReport } from '@common/type/DetailTxReport.model';
import { IOperator } from '@common/type/Operator.interface';
import { Operator } from '@common/type/Operator.model';
import { Work } from '@common/type/Work.model';
import {
  generateSalt,
  loadOrCreateModel,
  sha256Encrypt,
  sleep,
} from '@common/util/common';
import config from '@config/config';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { Op } from 'sequelize';

export default {
  async mappingDetailTxReport() {
    while (true) {
      // * 1. Find All DetailTxReport not execute
      const reports = await DetailTxReport.findAll({
        where: { executed: false },
      });

      // * 2. Mapping DetailTxReport and BankMsg
      for (const report of reports) {
        // * 2.1 Find NomineeBankAccount
        const { NomineeBankAccountId, remainingBalance, type, note } = report;
        const nomineeBankAccount = await NomineeBankAccountRepository.findNomineeBankAccountById(
          NomineeBankAccountId,
        );
        if (!nomineeBankAccount) {
          console.log(
            `DetailTxReport : ${EC[EC.NOMINEE_BANK_ACCOUNT_DOES_NOT_EXIST]}`,
          );
          report.executed = true;
          await report.save();
          continue;
        }
        // * 2.2 Prepare compare Data
        const amount = new BigNumber(report.amount).toNumber();
        const remainingAmount = new BigNumber(remainingBalance).toNumber();
        const tstamp = moment(report.tstamp).set('second', 0);
        let tx: BankMsg | Work | null = null;
        if (type === AccountType.DEPOSIT) {
          // * 2.3.1 If Deposit Find From BankMsg
          tx = await BankMsg.findOne({
            where: {
              tstamp,
              amount,
              NomineeBankAccountId: nomineeBankAccount.id,
              remainingAmount: {
                [Op.or]: {
                  [Op.is]: null,
                  [Op.eq]: remainingAmount,
                },
              },
            },
          });
        } else if (type === AccountType.WITHDRAW) {
          // * 2.3.2 If Withdraw Find From Work by Id
          const tmpTx = await Work.findAll({
            where: {
              type: TxType.WITHDRAW_BANK,
              owner: nomineeBankAccount.bankCode,
              subOwner: nomineeBankAccount.accountNo,
              'detail.amount': new BigNumber(report.amount).toNumber(),
              [Op.or]: [
                {
                  'result.transactionTstamp': moment(report.tstamp)
                    .startOf('day')
                    .toDate(),
                },
                { 'result.transactionTstamp': moment(report.tstamp).toDate() },
              ],
            },
          });
          tx = tmpTx.length !== 1 ? null : tmpTx[0];
        }
        // * 2.3 Update BalanceChange
        if (tx && tx.BalanceChangeId) {
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
          report.BalanceChangeId = tx.BalanceChangeId;
          report.OperatorId = systemOperator.id;
        }
        report.executed = true;
        await report.save();
      }
      // * Sleep Time
      await sleep(1000 * 10);
    }
  },
};
