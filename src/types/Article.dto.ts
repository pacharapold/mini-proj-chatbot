import { IArticleList } from '@common/type/Article.interface';
import { Pagination } from '@common/util/Page';
import { IsNotEmpty, IsObject } from 'class-validator';

export class ArticleListDto implements IArticleList {
  @IsObject()
  @IsNotEmpty()
  public pagination!: Pagination;
}
