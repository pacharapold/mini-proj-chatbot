import { loadAsBigNumber } from '@common/util/common';
import { DataTypes, AbstractDataTypeConstructor } from 'sequelize';

export const dataTypes = {
  primaryKey() {
    return {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    };
  },

  string(len: number, allowNull: boolean = false) {
    return {
      allowNull,
      type: DataTypes.STRING(len),
    };
  },

  bigNumber(
    fieldName: string,
    allowNull: boolean = false,
    precision: number = 30,
    scale: number = 10,
  ) {
    return {
      allowNull,
      type: DataTypes.DECIMAL(precision, scale),
      get(this: any) {
        return loadAsBigNumber(this, fieldName);
      },
    };
  },

  date(allowNull: boolean = false) {
    return {
      allowNull,
      type: DataTypes.DATE,
    };
  },

  boolean(defaultValue: boolean) {
    return {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: defaultValue ? true : false,
    };
  },

  bigInt(allowNull: boolean = false, defaultValue?: number) {
    const res: any = {
      allowNull,
      type: DataTypes.BIGINT,
    };
    if (defaultValue !== undefined) res.defaultValue = defaultValue;
    return res;
  },

  int(allowNull: boolean = false, defaultValue?: number) {
    const res: any = {
      allowNull,
      type: DataTypes.INTEGER,
    };
    if (defaultValue !== undefined) res.defaultValue = defaultValue;
    return res;
  },

  json(defaultValue: object = {}) {
    return {
      defaultValue,
      type: DataTypes.JSON,
      allowNull: false,
    };
  },

  text(allowNull: boolean = false) {
    return {
      allowNull,
      type: DataTypes.TEXT,
    };
  },

  array(dataType: AbstractDataTypeConstructor, defaultValue: any[] = []) {
    return {
      defaultValue,
      type: DataTypes.ARRAY(dataType),
      allowNull: false,
    };
  },
};
