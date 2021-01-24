import { AccountType } from '@common/enum/AccountType.enum';
import { INominee } from '@common/type/Nominee.interface';
import { Nominee } from '@common/type/Nominee.model';
import { INomineeBankAccount } from '@common/type/NomineeBankAccount.interface';
import { restrictedOnDelete } from '@common/util/common';
import { dataTypes } from '@common/util/dbutils';
import BigNumber from 'bignumber.js';
import { Model, Sequelize } from 'sequelize';

export class NomineeBankAccount extends Model implements INomineeBankAccount {
  public id!: number;
  public bankCode!: string;
  public accountNo!: string;
  public active!: boolean;
  public type!: AccountType;
  public username!: string;
  public password!: string;
  public smsTelNo!: string;
  public lastBalance!: BigNumber;
  public lastBalanceUpdate!: Date;
  public NomineeId!: number;
  public Nominee!: INominee;
  public sequence!: number;
  public auto!: boolean;
}

export default (database: Sequelize) => {
  NomineeBankAccount.init(
    {
      id: dataTypes.primaryKey(),
      bankCode: dataTypes.string(40),
      accountNo: dataTypes.string(100),
      active: dataTypes.boolean(false),
      type: dataTypes.string(40),
      username: dataTypes.string(100, true),
      password: dataTypes.string(100, true),
      smsTelNo: dataTypes.string(40),
      lastBalance: dataTypes.bigNumber('lastBalance', true),
      lastBalanceUpdate: dataTypes.date(true),
      sequence: dataTypes.int(false, 1),
      auto: dataTypes.boolean(true),
    },
    {
      tableName: 'nominee_bank_account',
      sequelize: database,
      indexes: [
        {
          unique: true,
          fields: ['bank_code', 'account_no', 'type'],
        },
      ],
    },
  );
  NomineeBankAccount.belongsTo(Nominee, restrictedOnDelete());
  Nominee.hasMany(NomineeBankAccount, restrictedOnDelete());
  return NomineeBankAccount;
};
