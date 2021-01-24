import { TxType } from '@common/enum/TxType.enum';
import { IBalanceChange } from '@common/type/BalanceChange.interface';
import { BalanceChange } from '@common/type/BalanceChange.model';
import { IBankMsg } from '@common/type/BankMsg.interface';
import { INomineeBankAccount } from '@common/type/NomineeBankAccount.interface';
import { NomineeBankAccount } from '@common/type/NomineeBankAccount.model';
import { IOperator } from '@common/type/Operator.interface';
import { Operator } from '@common/type/Operator.model';
import { ISms } from '@common/type/Sms.interface';
import { Sms } from '@common/type/Sms.model';
import { restrictedOnDelete } from '@common/util/common';
import { dataTypes } from '@common/util/dbutils';
import BigNumber from 'bignumber.js';
import { Model, Sequelize } from 'sequelize';

export class BankMsg extends Model implements IBankMsg {
  public id!: number;
  public type!: TxType;
  public tstamp!: Date;
  public fromBankCode!: string;
  public fromAccountNo!: string;
  public toBankCode!: string;
  public toAccountNo!: string;
  public amount!: BigNumber;
  public remainingAmount!: BigNumber;
  public executed!: boolean;
  public BalanceChangeId!: number;
  public BalanceChange!: IBalanceChange;
  public SmsId!: number;
  public Sms!: ISms;
  public NomineeBankAccountId!: number;
  public NomineeBankAccount!: INomineeBankAccount;
  public OperatorId!: number;
  public Operator!: IOperator;
  public readonly deletedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (database: Sequelize) => {
  BankMsg.init(
    {
      id: dataTypes.primaryKey(),
      amount: dataTypes.bigNumber('amount', true),
      remainingAmount: dataTypes.bigNumber('remainingAmount', true),
      fromBankCode: dataTypes.string(50, true),
      fromAccountNo: dataTypes.string(100, true),
      type: dataTypes.string(50, true),
      tstamp: dataTypes.date(),
      executed: dataTypes.boolean(false),
      toBankCode: dataTypes.string(50, true),
      toAccountNo: dataTypes.string(100, true),
    },
    {
      tableName: 'bank_msg',
      sequelize: database,
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          unique: false,
          fields: ['type', 'executed', { name: 'tstamp', order: 'DESC' }],
        },
      ],
    },
  );
  BankMsg.belongsTo(BalanceChange, restrictedOnDelete(true));
  BalanceChange.hasMany(BankMsg, restrictedOnDelete(true));
  BankMsg.belongsTo(Sms, { as: 'Sms' });
  BankMsg.belongsTo(NomineeBankAccount, restrictedOnDelete(true));
  NomineeBankAccount.hasMany(BankMsg, restrictedOnDelete(true));
  BankMsg.belongsTo(Operator, restrictedOnDelete(true));
  Operator.hasMany(BankMsg, restrictedOnDelete(true));
  return BankMsg;
};
