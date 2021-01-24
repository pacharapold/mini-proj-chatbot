import { Pagination } from '@common/util/Page';

export interface IQuestionSearch {
  pagination: Pagination;
  text: string;
}

export interface IQuestionCreate {
  title: string;
  content: string;
}

export interface IQuestionUpdate {
  QuestionId: number;
  title: string;
  content: string;
}
