import { Promotion } from '@common/enum/Promotion.enum';
import { Pagination } from '@common/util/Page';

export interface IArticle {
  id?: number;
  title: string;
  content: string;
  date: Date;
  image: string;
  tag: string[];
  site: string;
}

export interface IArticleSearch {
  pagination: Pagination;
  site: string;
  text: string;
}

export interface IArticleCreate {
  title: string;
  content: string;
  image: string;
  tag: string[];
  site: string;
}

export interface IArticleUpdate {
  articleId: number;
  title: string;
  content: string;
  image: string;
  tag: string[];
}

export interface IArticleList {
  pagination: Pagination;
}

export interface IArticleCopy {
  articleId: number;
  site: string;
}
