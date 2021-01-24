import { IGambler } from '@common/type/Gambler.interface';
import { Gambler } from '@common/type/Gambler.model';
import { Pagination } from '@common/util/Page';

export interface IProviderAccount {
  id: number;
  agentUserName: string;
  username: string;
  localId?: string;
  password: string;
  locked: boolean;
  GamblerId: number;
  Gambler: IGambler;
}

export interface IProviderAccountSearch {
  pagination: Pagination;
  text: string;
  locked: boolean;
  used: boolean;
}

export interface IAccountLocal {
  GamblerId: number;
  nextBalanceUpdate: number;
  refreshBalanceGap: number;
}
