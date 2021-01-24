import { ITxReportCreate } from '@common/type/TxReport.interface';
import { TxReport } from '@common/type/TxReport.model';
import moment from 'moment';
import { FindOptions } from 'sequelize';

export default {
  async createTxReport({
    statementDate,
    NomineeBankAccountId,
  }: ITxReportCreate) {
    const txTstamp = moment(statementDate).subtract(1, 'day');
    return await TxReport.create({
      statementDate,
      NomineeBankAccountId,
      fromTstamp: txTstamp.clone().startOf('day'),
      toTstamp: txTstamp.clone().endOf('day'),
      completed: false,
    });
  },
  async findById(id: number) {
    return await TxReport.findByPk(id);
  },
  async findOneWithCondition(condition: FindOptions) {
    return await TxReport.findOne(condition);
  },
};
