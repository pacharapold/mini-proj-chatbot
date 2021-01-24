import { IBettingReport } from '@common/type/BettingReport.interface';
import { IGambler } from '@common/type/Gambler.interface';
import { Gambler } from '@common/type/Gambler.model';
import { restrictedOnDelete } from '@common/util/common';
import { dataTypes } from '@common/util/dbutils';
import BigNumber from 'bignumber.js';
import { Model, Sequelize } from 'sequelize';

export class BettingReport extends Model implements IBettingReport {
  public id!: number;
  public agentUsername!: string;
  public statementDate!: Date;
  public dstamp!: Date;
  public currencyCode!: string;
  public turnover!: BigNumber;
  public validAmount!: BigNumber;
  public commission!: BigNumber;
  public win!: BigNumber;
  public betCount?: number;
  public GamblerId!: number;
  public Gambler!: IGambler;
}

export default (database: Sequelize) => {
  BettingReport.init(
    {
      id: dataTypes.primaryKey(),
      agentUsername: dataTypes.string(20),
      dstamp: dataTypes.date(),
      statementDate: dataTypes.date(),
      currencyCode: dataTypes.string(3),
      turnover: dataTypes.bigNumber('turnover'),
      validAmount: dataTypes.bigNumber('validAmount'),
      commission: dataTypes.bigNumber('commission'),
      win: dataTypes.bigNumber('win'),
      betCount: dataTypes.bigNumber('betCount'),
    },
    {
      tableName: 'betting_report',
      sequelize: database,
      indexes: [
        {
          unique: true,
          fields: ['gambler_id', 'statement_date', 'dstamp'],
        },
        {
          unique: false,
          fields: [
            'agent_username',
            'gambler_id',
            { name: 'dstamp', order: 'DESC' },
          ],
        },
      ],
    },
  );
  BettingReport.belongsTo(Gambler, restrictedOnDelete());
  Gambler.hasMany(BettingReport, restrictedOnDelete());
  return BettingReport;
};
