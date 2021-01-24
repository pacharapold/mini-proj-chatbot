import { ConfigTopic } from '@common/enum/ConfigTopic.enum';
import { IConfig, IConfigDetail } from '@common/type/Config.interface';
import { dataTypes } from '@common/util/dbutils';
import { Model, Sequelize } from 'sequelize';

export class Config extends Model implements IConfig {
  public id!: number;
  public topic!: ConfigTopic;
  public detail!: IConfigDetail;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

export default (database: Sequelize) => {
  Config.init(
    {
      id: dataTypes.primaryKey(),
      topic: dataTypes.string(100),
      detail: dataTypes.json(),
    },
    {
      tableName: 'config',
      sequelize: database,
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ['topic'],
          where: {
            deleted_at: null,
          },
        },
      ],
    },
  );
  return Config;
};
