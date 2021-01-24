import { Game } from '@common/enum/Game.enum';
import { IGambler } from '@common/type/Gambler.interface';
import { Pagination } from '@common/util/Page';
import BigNumber from 'bignumber.js';

export interface IDetailBettingReport {
  id: number;
  vendorCode: string;
  agentUsername: string;
  ticketSessionId: string;
  statementDate: Date;
  dstamp: Date;
  tstamp: Date;
  currencyCode: string;
  turnover: BigNumber;
  validAmount: BigNumber;
  commission: BigNumber;
  win: BigNumber;
  game: Game;
  detail?: any;
  GamblerId: number;
  Gambler: IGambler;
  createdAt: Date;
}

export interface IDetailBettingReportImi {
  vendorCode: string;
  agentUsername: string;
  ticketSessionId: string;
  statementDate: Date;
  dstamp: Date;
  tstamp: Date;
  currencyCode: string;
  turnover: BigNumber;
  validAmount: BigNumber;
  commission: BigNumber;
  win: BigNumber;
  game: Game;
  detail?: any;
  GamblerId: number;
}

export interface IDetailBettingReportSearch {
  pagination: Pagination;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  currencyCode: string[];
  game: string[];
  text: string;
}

export interface IDetailBettingReportGambler {
  pagination: Pagination;
}

export const GAMES: Record<string, string[]> = {
  [Game.BACCARAT]: [Game.BACCARAT, 'BAC'],
  [Game.ROULETTE]: [Game.ROULETTE],
  [Game.SLOT]: [Game.SLOT],
  [Game.SOCCER]: [Game.SOCCER],
  [Game.TIGER_DRAGON]: [Game.TIGER_DRAGON, 'TIGERDRAGON'],
};

export interface IDetailBettingReportSearchBySite {
  pagination: Pagination;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  game: string[];
  text: string;
  imiUsername: string;
}
