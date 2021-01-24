import { AccountType } from '@common/enum/AccountType.enum';
import TxReportRepository from '@common/repository/TxReport.repository';
import WorkService from '@common/service/Work.service';
import { TxReport } from '@common/type/TxReport.model';
import { transactionGuard } from '@midas-soft/midas-common';
import NomineeBankAccountService from '@service/NomineeBankAccount.service';
import moment from 'moment';
import schedule from 'node-schedule';
import { Op } from 'sequelize';

export default {
  async scheduleJobTxReportDaily() {
    const scheduleCrontab = `0 6 * * *`;
    schedule.scheduleJob(scheduleCrontab, async () => {
      await this.createTxReportDaily();
    });
  },

  async createTxReportDaily() {
    // * 1. Find All NomineeBankAccount
    const nomineeBankAccts = await NomineeBankAccountService.findWithCondition({
      where: {
        type: { [Op.in]: [AccountType.DEPOSIT, AccountType.WITHDRAW] },
      },
    });
    // * 2. Create TxReport each nomineeBankAccount
    for (const nomineeBackAcct of nomineeBankAccts) {
      const today = moment(new Date()).startOf('day');
      let lastRecordDate = today
        .clone()
        .subtract(2, 'day')
        .startOf('day');
      const latestTxReport = await TxReport.findOne({
        where: { NomineeBankAccountId: nomineeBackAcct.id },
        order: [['statement_date', 'DESC']],
      });
      if (latestTxReport) {
        lastRecordDate = moment(latestTxReport.statementDate).startOf('day');
      }
      if (today.isSame(lastRecordDate)) continue;
      const diffDay = Math.abs(today.diff(lastRecordDate, 'day'));
      for (let index = 1; index <= diffDay; index++) {
        const statementDate = lastRecordDate.clone().add(index, 'day');
        await transactionGuard(async () => {
          // * 2.1 Create TxReport
          await TxReportRepository.createTxReport({
            statementDate,
            NomineeBankAccountId: nomineeBackAcct.id,
          });
          // * 2.2 Crete Work Report for Puppeteer
          await WorkService.createReportWork({
            statementDate,
            NomineeBankAccountId: nomineeBackAcct.id,
          });
        });
      }
    }
  },
};
