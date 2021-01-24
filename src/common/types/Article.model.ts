import { IArticle } from '@common/type/Article.interface';
import { dataTypes } from '@common/util/dbutils';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class Article extends Model implements IArticle {
  public id!: number;
  public title!: string;
  public content!: string;
  public date!: Date;
  public image!: string;
  public tag!: string[];
  public site!: string;
  public readonly createdAt!: Date;
}

export default (database: Sequelize) => {
  Article.init(
    {
      id: dataTypes.primaryKey(),
      title: dataTypes.text(),
      content: dataTypes.text(),
      date: dataTypes.date(),
      image: dataTypes.text(true),
      tag: dataTypes.array(DataTypes.STRING),
      site: dataTypes.string(100, true),
    },
    {
      tableName: 'article',
      sequelize: database,
      indexes: [
        {
          unique: false,
          fields: ['title'],
        },
      ],
    },
  );
  return Article;
};
