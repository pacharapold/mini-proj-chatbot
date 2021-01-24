import BigNumber from 'bignumber.js';
import { dataTypes } from '@common/util/dbutils';
import { Gambler } from '@common/type/Gambler.model';
import { IGambler } from '@common/type/Gambler.interface';
import { Model, Sequelize } from 'sequelize';
import { restrictedOnDelete } from '@common/util/common';
import { ITurnover } from '@common/type/Turnover.interface';
export class Turnover extends Model implements ITurnover {
  public id!: number;
  public playedTurnover!: BigNumber;
  public turnover!: BigNumber;
  public GamblerId!: number;
  public Gambler!: IGambler;
  public lastUpdated!: Date;
}

export default (database: Sequelize) => {
  Turnover.init(
    {
      id: dataTypes.primaryKey(),
      playedTurnover: dataTypes.bigNumber('playedTurnover'),
      turnover: dataTypes.bigNumber('turnover'),
      lastUpdated: dataTypes.date(),
    },
    {
      tableName: 'turnover',
      sequelize: database,
      indexes: [
        {
          unique: true,
          fields: ['gambler_id'],
        },
      ],
    },
  );

  Turnover.belongsTo(Gambler, restrictedOnDelete());
  Gambler.hasMany(Turnover, restrictedOnDelete());
  return Turnover;
};
