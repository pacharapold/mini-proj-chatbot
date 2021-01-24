import { ISms } from '@common/type/Sms.interface';
import { ISmsDevice } from '@common/type/SmsDevice.interface';
import { SmsDevice } from '@common/type/SmsDevice.model';
import { restrictedOnDelete } from '@common/util/common';
import { dataTypes } from '@common/util/dbutils';
import { Model, Sequelize } from 'sequelize';

export class Sms extends Model implements ISms {
  public id!: number;
  public SmsDeviceId!: number;
  public SmsDevice!: ISmsDevice;
  public senderName!: string;
  public msg!: string;
  public tstamp!: Date;
  public readable!: boolean;
  public executed!: boolean;
}

export default (database: Sequelize) => {
  Sms.init(
    {
      id: dataTypes.primaryKey(),
      senderName: dataTypes.string(100),
      msg: dataTypes.string(1000),
      tstamp: dataTypes.date(),
      readable: dataTypes.boolean(false),
      executed: dataTypes.boolean(false),
    },
    {
      tableName: 'sms',
      sequelize: database,
      indexes: [
        {
          unique: false,
          fields: ['sms_device_id', { name: 'tstamp', order: 'DESC' }],
        },
      ],
    },
  );
  Sms.belongsTo(SmsDevice, restrictedOnDelete());
  SmsDevice.hasMany(Sms, restrictedOnDelete());
  return Sms;
};
