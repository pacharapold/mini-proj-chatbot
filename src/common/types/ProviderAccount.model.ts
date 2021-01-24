import { IGambler } from '@common/type/Gambler.interface';
import { Gambler } from '@common/type/Gambler.model';
import { IProviderAccount } from '@common/type/ProviderAccount.interface';
import { restrictedOnDelete } from '@common/util/common';
import { dataTypes } from '@common/util/dbutils';
import { Model, Sequelize } from 'sequelize';

export class ProviderAccount extends Model implements IProviderAccount {
  public id!: number;
  public agentUserName!: string;
  public username!: string;
  public localId!: string;
  public password!: string;
  public locked!: boolean;
  public GamblerId!: number;
  public Gambler!: IGambler;
}

export default (database: Sequelize) => {
  ProviderAccount.init(
    {
      id: dataTypes.primaryKey(),
      agentUserName: dataTypes.string(100),
      username: dataTypes.string(100),
      localId: dataTypes.string(100, true),
      password: dataTypes.string(100),
      locked: dataTypes.boolean(false),
    },
    {
      tableName: 'provider_account',
      sequelize: database,
      indexes: [
        {
          unique: true,
          fields: ['username'],
        },
        {
          unique: true,
          fields: ['gambler_id'],
        },
      ],
    },
  );
  ProviderAccount.belongsTo(Gambler, restrictedOnDelete(true));
  Gambler.hasMany(ProviderAccount, restrictedOnDelete(true));
  return ProviderAccount;
};
