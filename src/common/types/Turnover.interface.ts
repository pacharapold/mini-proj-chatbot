import BigNumber from 'bignumber.js';
import { IGambler } from '@common/type/Gambler.interface';

export interface ITurnover {
  id: number;
  playedTurnover: BigNumber;
  turnover: BigNumber;
  GamblerId: number;
  Gambler: IGambler;
  lastUpdated: Date;
}

export interface ITurnoverUpdate {
  playedTurnover: BigNumber;
  turnover: BigNumber;
  GamblerId: number;
  lastUpdated: Date;
}

export interface ITurnoverCountResult {
  balance: BigNumber;
  turnover: BigNumber;
  lastUpdated: Date;
}

export interface ITurnoverUserProfileUI {
  played: BigNumber;
  target: BigNumber;
}
