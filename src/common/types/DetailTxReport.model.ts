import { AccountType } from '@common/enum/AccountType.enum';
import { IBalanceChange } from '@common/type/BalanceChange.interface';
import { BalanceChange } from '@common/type/BalanceChange.model';
import { IDetailTxReport } from '@common/type/DetailTxReport.interface';
import { INomineeBankAccount } from '@common/type/NomineeBankAccount.interface';
import { NomineeBankAccount } from '@common/type/NomineeBankAccount.model';
import { IOperator } from '@common/type/Operator.interface';
import { Operator } from '@common/type/Operator.model';
import { restrictedOnDelete } from '@common/util/common';
import { dataTypes } from '@common/util/dbutils';
import BigNumber from 'bignumber.js';
import { Model, Sequelize } from 'sequelize';

export class DetailTxReport extends Model implements IDetailTxReport {
  public id!: number;
  public type!: AccountType;
  public executed!: boolean;
  public tstamp!: Date;
  public txType!: string;
  public amount!: BigNumber;
  public remainingBalance!: BigNumber;
  public serviceChannel!: string;
  public note!: string;
  public remark!: string;
  public BalanceChangeId!: number;
  public BalanceChange!: IBalanceChange;
  public OperatorId!: number;
  public Operator!: IOperator;
  public NomineeBankAccountId!: number;
  public NomineeBankAccount!: INomineeBankAccount;
}

export default (database: Sequelize) => {
  DetailTxReport.init(
    {
      id: dataTypes.primaryKey(),
      type: dataTypes.string(40),
      executed: dataTypes.boolean(false),
      tstamp: dataTypes.date(),
      txType: dataTypes.string(1000, true),
      amount: dataTypes.bigNumber(`amount`),
      remainingBalance: dataTypes.bigNumber(`remainingBalance`),
      serviceChannel: dataTypes.string(1000, true),
      note: dataTypes.string(1000, true),
      remark: dataTypes.string(1000, true),
    },
    {
      tableName: 'detail_tx_report',
      sequelize: database,
      indexes: [
        {
          unique: false,
          fields: ['type', 'executed'],
        },
        {
          unique: true,
          fields: ['tstamp', 'type', 'amount', 'nominee_bank_account_id'],
        },
      ],
    },
  );
  DetailTxReport.belongsTo(BalanceChange, restrictedOnDelete(true));
  BalanceChange.hasOne(DetailTxReport, restrictedOnDelete(true));
  DetailTxReport.belongsTo(Operator, restrictedOnDelete(true));
  Operator.hasOne(DetailTxReport, restrictedOnDelete(true));
  DetailTxReport.belongsTo(NomineeBankAccount, restrictedOnDelete(true));
  NomineeBankAccount.hasOne(DetailTxReport, restrictedOnDelete(true));
  return DetailTxReport;
};
