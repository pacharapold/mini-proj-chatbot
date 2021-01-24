import { IGambler } from '@common/type/Gambler.interface';
import { Pagination } from '@common/util/Page';
import BigNumber from 'bignumber.js';

export interface IBettingReport {
  id: number;
  agentUsername: string;
  statementDate: Date;
  dstamp: Date;
  currencyCode: string;
  turnover: BigNumber;
  validAmount: BigNumber;
  commission: BigNumber;
  win: BigNumber;
  betCount?: number;
  GamblerId: number;
  Gambler: IGambler;
}

export interface ISumBettingReport {
  agentUsername: string;
  dstamp: Date;
  statementDate: Date;
  currencyCode: string;
  turnover: BigNumber;
  validAmount: BigNumber;
  win: BigNumber;
  betCount?: number;
  GamblerId: number;
}

export interface IBettingReportSearch {
  pagination: Pagination;
  text: string;
  startDate: string;
  endDate: string;
  currencyCode: string[];
}

export interface IBettingReportSearchBySite {
  pagination: Pagination;
  text: string;
  startDate: string;
  endDate: string;
  currencyCode: string[];
  imiUsername: string;
}
