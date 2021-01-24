import { IGambler } from '@common/type/Gambler.interface';
import { Gambler } from '@common/type/Gambler.model';
import { restrictedOnDelete } from '@common/util/common';
import { dataTypes } from '@common/util/dbutils';
import BigNumber from 'bignumber.js';
import { Model, Sequelize } from 'sequelize';
import { ICommission } from '@common/type/Commission.interface';
import { BalanceChange } from '@common/type/BalanceChange.model';
import { IBalanceChange } from '@common/type/BalanceChange.interface';

export class Commission extends Model implements ICommission {
  public id!: number;
  public dstamp!: Date;
  public validAmount!: BigNumber;
  public promotionPaid!: BigNumber;
  public rate!: number;
  public beginDstamp!: Date;
  public expiredAt!: Date;
  public accepted!: boolean;
  public acceptedTstamp?: Date;
  public executed!: boolean;
  public executedTstamp?: Date;
  public GamblerId!: number;
  public Gambler!: IGambler;
  public BalanceChangeId?: number;
  public BalanceChange?: IBalanceChange;
}

export default (database: Sequelize) => {
  Commission.init(
    {
      id: dataTypes.primaryKey(),
      dstamp: dataTypes.date(),
      validAmount: dataTypes.bigNumber('validAmount'),
      promotionPaid: dataTypes.bigNumber('promotionPaid'),
      rate: dataTypes.bigNumber('rate'),
      beginDstamp: dataTypes.date(),
      expiredAt: dataTypes.date(),
      accepted: dataTypes.boolean(false),
      acceptedTstamp: dataTypes.date(true),
      executed: dataTypes.boolean(false),
      executedTstamp: dataTypes.date(true),
    },
    {
      tableName: 'commission',
      sequelize: database,
      indexes: [
        {
          unique: true,
          fields: ['gambler_id', 'balance_change_id', 'dstamp'],
        },
      ],
    },
  );
  Gambler.hasMany(Commission, restrictedOnDelete());
  Commission.belongsTo(Gambler, restrictedOnDelete());
  BalanceChange.hasMany(Commission, restrictedOnDelete(true));
  Commission.belongsTo(BalanceChange, restrictedOnDelete(true));
  return Commission;
};
