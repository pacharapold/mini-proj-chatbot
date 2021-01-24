import BigNumber from 'bignumber.js';
import { dataTypes } from '@common/util/dbutils';
import { Gambler } from '@common/type/Gambler.model';
import { getEpochId } from '@common/util/epochid';
import { IBalance, IBalanceDetail } from '@common/type/Balance.interface';
import { IGambler } from '@common/type/Gambler.interface';
import { Model, Sequelize } from 'sequelize';
import { restrictedOnDelete } from '@common/util/common';

export class Balance extends Model implements IBalance {
  public id!: number;
  public GamblerId!: number;
  public Gambler!: IGambler;
  public currencyCode!: string;
  public amount!: BigNumber;
  public lastBalanceUpdate!: Date;
  public needUpdateBalance!: boolean;
  public needUpdateUi!: boolean;
  public detail!: IBalanceDetail;
}

export default (database: Sequelize) => {
  Balance.init(
    {
      id: dataTypes.primaryKey(),
      currencyCode: dataTypes.string(100),
      amount: dataTypes.bigNumber('amount'),
      lastBalanceUpdate: dataTypes.date(),
      needUpdateBalance: dataTypes.boolean(false),
      needUpdateUi: dataTypes.boolean(false),
      detail: dataTypes.json(),
    },
    {
      tableName: 'balance',
      sequelize: database,
      indexes: [
        {
          unique: true,
          fields: ['gambler_id', 'currency_code'],
        },
      ],
    },
  );
  Balance.belongsTo(Gambler, restrictedOnDelete());
  Gambler.hasMany(Balance, restrictedOnDelete());
  return Balance;
};
