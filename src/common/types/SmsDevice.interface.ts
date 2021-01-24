import { Pagination } from '@common/util/Page';

export interface ISmsDevice {
  id: number;
  key: string;
  remark: string;
}

export interface ISmsDeviceNew {
  key: string;
  remark: string;
}

export interface ISmsDeviceFilter {
  text: string;
  pagination: Pagination;
}
