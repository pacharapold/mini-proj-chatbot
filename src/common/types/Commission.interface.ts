import BigNumber from 'bignumber.js';
import { IGambler } from '@common/type/Gambler.interface';
import { IBalanceChange } from '@common/type/BalanceChange.interface';
import { Pagination } from '@common/util/Page';

export interface ICommission {
  id: number;
  dstamp: Date;
  validAmount: BigNumber;
  promotionPaid: BigNumber;
  rate: number;
  beginDstamp: Date;
  expiredAt: Date;
  accepted: boolean;
  acceptedTstamp?: Date;
  executed: boolean;
  executedTstamp?: Date;
  GamblerId: number;
  Gambler: IGambler;
  BalanceChangeId?: number;
  BalanceChange?: IBalanceChange;
}

export interface ICommissionCreate {
  dstamp: Date;
  validAmount: BigNumber;
  promotionPaid: BigNumber;
  rate: number;
  beginDstamp: Date;
  expiredAt: Date;
  GamblerId: number;
}

export interface ICommissionResult {
  id: number;
  dstamp: Date;
  validAmount: BigNumber;
  promotionPaid: BigNumber;
  rate: number;
  beginDstamp: Date;
  expiredAt: Date;
  expired: boolean;
  accepted: boolean;
  acceptedTstamp?: Date;
}

export interface ICommissionSearch {
  pagination: Pagination;
  startDate: string;
  endDate: string;
  accepted: boolean | null;
  executed: boolean | null;
  expired: boolean | null;
  text: string;
}

export interface ICommissionSearchResult {
  id: number;
  username: string;
  telNo: string;
  dstamp: Date;
  validAmount: BigNumber;
  promotionPaid: BigNumber;
  rate: number;
  beginDstamp: Date;
  expiredAt: Date;
  accepted: boolean;
  acceptedTstamp?: Date;
  executed: boolean;
  executedTstamp?: Date;
}
