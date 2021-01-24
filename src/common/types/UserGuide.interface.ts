import { Pagination } from '@common/util/Page';

export interface IUserGuideSearch {
  pagination: Pagination;
  text: string;
}

export interface IUserGuideCreate {
  title: string;
  content: string;
}

export interface IUserGuideUpdate {
  UserGuideId: number;
  title: string;
  content: string;
}
