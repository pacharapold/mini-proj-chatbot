import { dataTypes } from '@common/util/dbutils';
import { getEpochId } from '@common/util/epochid';
import BigNumber from 'bignumber.js';
import { Model, Sequelize } from 'sequelize';

export interface ISample {
  id: number;
  code?: string;
  dd: string;
  price: BigNumber;
}

export class Sample extends Model implements ISample {
  public id!: number;
  public code!: string;
  public dd!: string;
  public price!: BigNumber;
}

export default (database: Sequelize) => {
  Sample.init(
    {
      id: dataTypes.primaryKey(),
      code: dataTypes.string(40),
      dd: dataTypes.date(),
      price: dataTypes.bigNumber('price'),
    },
    {
      tableName: 'sample',
      sequelize: database,
      indexes: [
        {
          unique: true,
          fields: ['code', { name: 'dd', order: 'DESC' }],
        },
        {
          unique: true,
          fields: [{ name: 'dd', order: 'DESC' }, 'code'],
        },
      ],
    },
  );

  Sample.addHook('beforeCreate', (instance: Sample, options) => {
    instance.id = getEpochId('Sample');
  });

  return Sample;
};
