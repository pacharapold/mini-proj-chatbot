import { INominee } from '@common/type/Nominee.interface';
import { dataTypes } from '@common/util/dbutils';
import { Model, Sequelize } from 'sequelize';

export class Nominee extends Model implements INominee {
  public id!: number;
  public fullName!: string;
  public telNo!: string;
  public alias!: string;
}

export default (database: Sequelize) => {
  Nominee.init(
    {
      id: dataTypes.primaryKey(),
      fullName: dataTypes.string(100),
      telNo: dataTypes.string(40),
      alias: dataTypes.string(40),
    },
    {
      tableName: 'nominee',
      sequelize: database,
      indexes: [
        {
          unique: true,
          fields: ['alias'],
        },
      ],
    },
  );
  return Nominee;
};
