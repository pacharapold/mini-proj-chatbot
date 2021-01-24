import { Game } from '@common/enum/Game.enum';
import { IDetailBettingReport } from '@common/type/DetailBettingReport.interface';
import { IGambler } from '@common/type/Gambler.interface';
import { Gambler } from '@common/type/Gambler.model';
import { restrictedOnDelete } from '@common/util/common';
import { dataTypes } from '@common/util/dbutils';
import BigNumber from 'bignumber.js';
import { Model, Sequelize } from 'sequelize';

export class DetailBettingReport extends Model implements IDetailBettingReport {
  public id!: number;
  public vendorCode!: string;
  public agentUsername!: string;
  public ticketSessionId!: string;
  public statementDate!: Date;
  public dstamp!: Date;
  public tstamp!: Date;
  public currencyCode!: string;
  public turnover!: BigNumber;
  public validAmount!: BigNumber;
  public commission!: BigNumber;
  public win!: BigNumber;
  public game!: Game;
  public detail!: any;
  public GamblerId!: number;
  public Gambler!: IGambler;
  public readonly createdAt!: Date;
}

export default (database: Sequelize) => {
  DetailBettingReport.init(
    {
      id: dataTypes.primaryKey(),
      vendorCode: dataTypes.string(10),
      agentUsername: dataTypes.string(40),
      statementDate: dataTypes.date(),
      dstamp: dataTypes.date(),
      tstamp: dataTypes.date(),
      currencyCode: dataTypes.string(40),
      turnover: dataTypes.bigNumber('turnover'),
      validAmount: dataTypes.bigNumber('validAmount'),
      commission: dataTypes.bigNumber('commission'),
      win: dataTypes.bigNumber('win'),
      game: dataTypes.string(40),
      ticketSessionId: dataTypes.string(64),
      detail: dataTypes.json(),
    },
    {
      tableName: 'detail_betting_report',
      sequelize: database,
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['gambler_id', 'ticket_session_id'],
        },
        {
          unique: false,
          fields: ['agent_username', 'gambler_id'],
        },
      ],
    },
  );
  Gambler.hasMany(DetailBettingReport, restrictedOnDelete());
  DetailBettingReport.belongsTo(Gambler, restrictedOnDelete());
  return DetailBettingReport;
};
