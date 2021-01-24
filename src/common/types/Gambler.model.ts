import GamblerType from '@common/enum/GamblerType.enum';
import { SocialType } from '@common/enum/SocialType.enum';
import TelNoStatus from '@common/enum/TelNoStatus.enum';
import { IGambler } from '@common/type/Gambler.interface';
import { dataTypes } from '@common/util/dbutils';
import { Model, Sequelize } from 'sequelize';

export class Gambler extends Model implements IGambler {
  public id!: number;
  public telNo!: string;
  public username!: string;
  public telNoStatus!: TelNoStatus;
  public type!: GamblerType;
  public password!: string;
  public refCode!: string;
  public hash!: string;
  public lastForgetPass!: Date | null;
  public lastChangePass!: Date | null;
  public refGamblerId!: number;
  public Gambler!: IGambler;
  public parent!: IGambler;
  public social!: SocialType;
  public site!: string;
  public readonly createdAt!: Date;
}

export default (database: Sequelize) => {
  Gambler.init(
    {
      id: dataTypes.primaryKey(),
      telNo: dataTypes.string(100, true),
      username: dataTypes.string(100),
      telNoStatus: dataTypes.string(100),
      type: dataTypes.string(100),
      password: dataTypes.string(100),
      hash: dataTypes.string(100),
      refCode: dataTypes.string(100),
      social: dataTypes.string(1000),
      lastForgetPass: dataTypes.date(true),
      lastChangePass: dataTypes.date(true),
      site: dataTypes.string(100),
    },
    {
      tableName: 'gambler',
      sequelize: database,
      timestamps: true,
      indexes: [
        { unique: true, fields: ['tel_no', 'username'] },
        {
          unique: false,
          fields: ['ref_gambler_id'],
        },
        {
          unique: false,
          fields: ['tel_no', 'username', 'site'],
        },
      ],
    },
  );
  Gambler.hasMany(Gambler, { as: 'children', foreignKey: 'refGamblerId' });
  Gambler.belongsTo(Gambler, { as: 'parent', foreignKey: 'refGamblerId' });
  return Gambler;
};
