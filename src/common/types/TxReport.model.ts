import { INomineeBankAccount } from '@common/type/NomineeBankAccount.interface';
import { NomineeBankAccount } from '@common/type/NomineeBankAccount.model';
import { ITxReport } from '@common/type/TxReport.interface';
import { restrictedOnDelete } from '@common/util/common';
import { dataTypes } from '@common/util/dbutils';
import { Model, Sequelize } from 'sequelize';

export class TxReport extends Model implements ITxReport {
  public id!: number;
  public statementDate!: Date;
  public fromTstamp!: Date;
  public toTstamp!: Date;
  public completed!: boolean;
  public NomineeBankAccountId!: number;
  public NomineeBankAccount!: INomineeBankAccount;
}

export default (database: Sequelize) => {
  TxReport.init(
    {
      id: dataTypes.primaryKey(),
      statementDate: dataTypes.date(),
      fromTstamp: dataTypes.date(),
      toTstamp: dataTypes.date(),
      completed: dataTypes.boolean(false),
    },
    {
      tableName: 'tx_report',
      sequelize: database,
      indexes: [
        {
          unique: false,
          fields: ['statement_date', 'completed'],
        },
        {
          unique: true,
          fields: ['statement_date', 'nominee_bank_account_id'],
        },
      ],
    },
  );
  TxReport.belongsTo(NomineeBankAccount, restrictedOnDelete(true));
  NomineeBankAccount.hasMany(TxReport, restrictedOnDelete(true));
  return TxReport;
};
