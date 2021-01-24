import { IAdmin, IAdminDetail } from '@common/type/Admin.interface';
import { dataTypes } from '@common/util/dbutils';
import { Model, Sequelize } from 'sequelize';

export class Admin extends Model implements IAdmin {
  public id!: number;
  public username!: string;
  public password!: string;
  public telNo!: string;
  public detail!: IAdminDetail;
  public salt!: string;
}

export default (database: Sequelize) => {
  Admin.init(
    {
      id: dataTypes.primaryKey(),
      username: dataTypes.string(100),
      password: dataTypes.string(100),
      telNo: dataTypes.string(40),
      detail: dataTypes.json(),
      salt: dataTypes.string(128),
    },
    {
      tableName: 'admin',
      sequelize: database,
      indexes: [
        {
          unique: true,
          fields: ['username'],
        },
      ],
    },
  );
  return Admin;
};
