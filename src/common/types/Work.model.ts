import { TxType } from '@common/enum/TxType.enum';
import { IBalanceChange } from '@common/type/BalanceChange.interface';
import { BalanceChange } from '@common/type/BalanceChange.model';
import { IGambler } from '@common/type/Gambler.interface';
import { Gambler } from '@common/type/Gambler.model';
import { INomineeBankAccountRefreshBalanceReport } from '@common/type/NomineeBankAccount.interface';
import {
  IBankResult,
  IBankWork,
  IProviderResult,
  IProviderWork,
  IWork,
} from '@common/type/Work.interface';
import { restrictedOnDelete } from '@common/util/common';
import { dataTypes } from '@common/util/dbutils';
import { Model, Sequelize } from 'sequelize';

export class Work extends Model implements IWork {
  public id!: number;
  public type!: TxType;
  public owner!: string;
  public subOwner!: string;
  public currencyCode!: string;
  public detail!: IProviderWork | IBankWork;
  public result!:
    | IProviderResult
    | IBankResult
    | INomineeBankAccountRefreshBalanceReport;
  public createTstamp!: Date;
  public completed!: boolean;
  public completedTstamp!: Date;
  public executed!: boolean;
  public executedTstamp!: Date;
  public seq!: Date;
  public BalanceChangeId!: number;
  public GamblerId!: number;
  public Gambler!: IGambler;
  public BalanceChange!: IBalanceChange;
}

export default (database: Sequelize) => {
  Work.init(
    {
      id: dataTypes.primaryKey(),
      type: dataTypes.string(40),
      owner: dataTypes.string(40),
      subOwner: dataTypes.string(40),
      currencyCode: dataTypes.string(40),
      detail: dataTypes.json(),
      result: dataTypes.json(),
      createTstamp: dataTypes.date(),
      completed: dataTypes.boolean(false),
      completedTstamp: dataTypes.date(true),
      executed: dataTypes.boolean(false),
      executedTstamp: dataTypes.date(true),
      seq: dataTypes.date(),
    },
    {
      tableName: 'work',
      sequelize: database,
      indexes: [
        {
          unique: false,
          fields: ['completed', 'owner', 'sub_owner', 'type', 'seq'],
        },
      ],
    },
  );
  Work.belongsTo(BalanceChange, restrictedOnDelete(true));
  BalanceChange.hasMany(Work, restrictedOnDelete(true));
  Work.belongsTo(Gambler, restrictedOnDelete(true));
  Gambler.hasMany(Work, restrictedOnDelete(true));
  return Work;
};
