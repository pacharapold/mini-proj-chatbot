import { ChannelType } from '@common/enum/ChannelType.enum';
import { IPuppeteerChannel } from '@common/type/PuppeteerChannel.interface';
import { dataTypes } from '@common/util/dbutils';
import { Model, Sequelize } from 'sequelize';

export class PuppeteerChannel extends Model implements IPuppeteerChannel {
  public id!: number;
  public ipAddress!: string;
  public owner!: string;
  public subOwner!: string;
  public active!: boolean;
  public type!: ChannelType;
}

export default (database: Sequelize) => {
  PuppeteerChannel.init(
    {
      id: dataTypes.primaryKey(),
      ipAddress: dataTypes.string(20),
      owner: dataTypes.string(20),
      subOwner: dataTypes.string(20),
      active: dataTypes.boolean(true),
      type: dataTypes.string(20),
    },
    {
      tableName: 'puppeteer_channel',
      sequelize: database,
      indexes: [
        {
          unique: true,
          fields: ['owner', 'sub_owner', 'ip_address'],
        },
      ],
    },
  );
  return PuppeteerChannel;
};
