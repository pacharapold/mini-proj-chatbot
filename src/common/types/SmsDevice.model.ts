import { ISmsDevice } from '@common/type/SmsDevice.interface';
import { dataTypes } from '@common/util/dbutils';
import { Model, Sequelize } from 'sequelize';

export class SmsDevice extends Model implements ISmsDevice {
  public id!: number;
  public key!: string;
  public remark!: string;
}

export default (database: Sequelize) => {
  SmsDevice.init(
    {
      id: dataTypes.primaryKey(),
      key: dataTypes.string(100),
      remark: dataTypes.string(100, true),
    },
    {
      tableName: 'sms_device',
      sequelize: database,
      indexes: [
        {
          unique: true,
          fields: ['key'],
        },
      ],
    },
  );
  return SmsDevice;
};
