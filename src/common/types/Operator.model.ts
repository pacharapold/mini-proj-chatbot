import { Role } from '@common/enum/Role.enum';
import { IOperator } from '@common/type/Operator.interface';
import { dataTypes } from '@common/util/dbutils';
import { Model, Sequelize } from 'sequelize';

export class Operator extends Model implements IOperator {
  public id!: number;
  public role!: Role;
  public name!: string;
  public username!: string;
  public password!: string;
  public telNo!: string;
  public salt!: string;
  public active!: boolean;
  public site!: string;
}

export default (database: Sequelize) => {
  Operator.init(
    {
      id: dataTypes.primaryKey(),
      role: dataTypes.string(40),
      name: dataTypes.string(100),
      username: dataTypes.string(100),
      password: dataTypes.string(100),
      telNo: dataTypes.string(40),
      salt: dataTypes.string(128),
      active: dataTypes.boolean(true),
      site: dataTypes.string(128, true),
    },
    {
      tableName: 'operator',
      sequelize: database,
      indexes: [
        {
          unique: true,
          fields: ['username'],
        },
      ],
    },
  );
  return Operator;
};
