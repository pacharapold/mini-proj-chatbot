import { IBettingReportStatus } from '@common/type/BettingReportStatus.interface';
import { dataTypes } from '@common/util/dbutils';
import { Model, Sequelize } from 'sequelize';

export class BettingReportStatus extends Model implements IBettingReportStatus {
  public id!: number;
  public createDstamp!: Date;
  public completed!: boolean;
  public completedTstamp!: Date;
  public readonly updatedAt!: Date;
}

export default (database: Sequelize) => {
  BettingReportStatus.init(
    {
      id: dataTypes.primaryKey(),
      createDstamp: dataTypes.date(),
      completed: dataTypes.boolean(false),
      completedTstamp: dataTypes.date(true),
    },
    {
      tableName: 'betting_report_status',
      sequelize: database,
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['create_dstamp', 'completed'],
        },
      ],
    },
  );
  return BettingReportStatus;
};
