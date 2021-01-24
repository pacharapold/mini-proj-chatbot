import { IGambler } from '@common/type/Gambler.interface';
import { Gambler } from '@common/type/Gambler.model';
import { IGamblerBankAccount } from '@common/type/GamblerBankAccount.interface';
import { restrictedOnDelete } from '@common/util/common';
import { dataTypes } from '@common/util/dbutils';
import { Model, Sequelize } from 'sequelize';

export class GamblerBankAccount extends Model implements IGamblerBankAccount {
  public id!: number;
  public bankCode!: string;
  public accountNo!: string;
  public accountName!: string;
  public lockWithdraw!: boolean;
  public active!: boolean;
  public verifyName!: string;
  public accountNameRetrieved!: boolean;
  public GamblerId!: number;
  public Gambler!: IGambler;
  public autoDeposit!: boolean;
  public disabledDepositTstamp!: Date;
  public validateTurnover!: boolean;
  public sequence!: number;
  public decimal!: number;
}

export default (database: Sequelize) => {
  GamblerBankAccount.init(
    {
      id: dataTypes.primaryKey(),
      bankCode: dataTypes.string(100),
      accountNo: dataTypes.string(100),
      accountName: dataTypes.string(100),
      lockWithdraw: dataTypes.boolean(false),
      active: dataTypes.boolean(false),
      verifyName: dataTypes.string(100, true),
      accountNameRetrieved: dataTypes.boolean(false),
      autoDeposit: dataTypes.boolean(true),
      disabledDepositTstamp: dataTypes.date(true),
      validateTurnover: dataTypes.boolean(true),
      sequence: dataTypes.int(false, 1),
      decimal: dataTypes.int(true),
    },
    {
      tableName: 'gambler_bank_account',
      sequelize: database,
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['bank_code', 'account_no'],
        },
        {
          unique: false,
          fields: ['bank_code', 'account_no', 'sequence'],
        },
      ],
    },
  );
  GamblerBankAccount.belongsTo(Gambler, restrictedOnDelete());
  Gambler.hasMany(GamblerBankAccount, restrictedOnDelete());
  return GamblerBankAccount;
};
