import { Pagination } from '@common/util/Page';

export interface INominee {
  id: number;
  fullName: string;
  telNo: string;
  alias: string;
}

export interface INomineeCreate {
  fullName: string;
  telNo: string;
  alias: string;
}

export interface INomineeSearch {
  pagination: Pagination;
  text: string;
}
