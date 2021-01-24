import { OtpRequestType } from '@common/enum/OtpRequestType.enum';
import { IOtpRequest } from '@common/type/OtpRequest.interface';
import { dataTypes } from '@common/util/dbutils';
import { Model, Sequelize } from 'sequelize';

export class OtpRequest extends Model implements IOtpRequest {
  public id!: number;
  public type!: OtpRequestType;
  public telNo!: string;
  public reference!: string;
  public otp!: string;
  public expiredAt!: Date;
  public executed!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (database: Sequelize) => {
  OtpRequest.init(
    {
      id: dataTypes.primaryKey(),
      type: dataTypes.string(100),
      telNo: dataTypes.string(100),
      reference: dataTypes.string(100),
      otp: dataTypes.string(100),
      expiredAt: dataTypes.date(),
      executed: dataTypes.boolean(false),
    },
    {
      tableName: 'otp_request',
      sequelize: database,
      timestamps: true,
      indexes: [
        { unique: false, fields: ['tel_no', 'reference', 'otp', 'executed'] },
      ],
    },
  );
  return OtpRequest;
};
