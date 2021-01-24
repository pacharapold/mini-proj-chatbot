import { TxType } from '@common/enum/TxType.enum';
import { WorkStatus } from '@common/enum/WorkStatus.enum';
import {
  IBalanceChange,
  IBalanceChangeDetail,
} from '@common/type/BalanceChange.interface';
import { IGambler } from '@common/type/Gambler.interface';
import { Gambler } from '@common/type/Gambler.model';
import { restrictedOnDelete } from '@common/util/common';
import { dataTypes } from '@common/util/dbutils';
import BigNumber from 'bignumber.js';
import { Model, Sequelize } from 'sequelize';

export class BalanceChange extends Model implements IBalanceChange {
  public id!: number;
  public GamblerId!: number;
  public Gambler!: IGambler;
  public type!: TxType;
  public currencyCode!: string;
  public amountBefore!: BigNumber;
  public amount!: BigNumber;
  public amountAfter!: BigNumber;
  public tstamp!: Date;
  public status!: WorkStatus;
  public details!: IBalanceChangeDetail;
}

export default (database: Sequelize) => {
  BalanceChange.init(
    {
      id: dataTypes.primaryKey(),
      type: dataTypes.string(100),
      currencyCode: dataTypes.string(100),
      amountBefore: dataTypes.bigNumber('amountBefore'),
      amount: dataTypes.bigNumber('amount'),
      amountAfter: dataTypes.bigNumber('amountAfter'),
      tstamp: dataTypes.date(),
      details: dataTypes.json(),
      status: dataTypes.string(100),
    },
    {
      tableName: 'balance_change',
      sequelize: database,
      indexes: [
        {
          unique: false,
          fields: ['gambler_id', 'currency_code', 'id'],
        },
        {
          unique: false,
          fields: [
            'gambler_id',
            'currency_code',
            { name: 'tstamp', order: 'DESC' },
          ],
        },
        {
          unique: false,
          fields: ['gambler_id', 'type', { name: 'tstamp', order: 'DESC' }],
        },
      ],
    },
  );
  BalanceChange.belongsTo(Gambler, restrictedOnDelete());
  Gambler.hasMany(BalanceChange, restrictedOnDelete());
  return BalanceChange;
};
