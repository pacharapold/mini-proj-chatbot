import GamblerType from '@common/enum/GamblerType.enum';
import { SocialType } from '@common/enum/SocialType.enum';
import TelNoStatus from '@common/enum/TelNoStatus.enum';
import { IGambler } from '@common/type/Gambler.interface';
import { dataTypes } from '@common/util/dbutils';
import BigNumber from 'bignumber.js';
import { Model, Sequelize } from 'sequelize';

export class Gambler extends Model implements IGambler {
  public id!: number;
  public userId!: string;
  public username!: string;
  public balance!: BigNumber;
  public lastBalanceUpdate!: Date;
  public readonly createdAt!: Date;
}

export default (database: Sequelize) => {
  Gambler.init(
    {
      id: dataTypes.primaryKey(),
      userId: dataTypes.string(100),
      username: dataTypes.string(100),
      balance: dataTypes.bigNumber('balance'),
      lastBalanceUpdate: dataTypes.date(),
    },
    {
      tableName: 'gambler',
      sequelize: database,
      timestamps: true,
      indexes: [{ unique: true, fields: ['user_id'] }],
    },
  );
  return Gambler;
};
