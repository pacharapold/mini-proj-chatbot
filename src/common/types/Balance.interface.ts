import BigNumber from 'bignumber.js';
import { IGambler } from '@common/type/Gambler.interface';

export type IBalanceDetail = {};

export interface IBalance {
  id: number;
  GamblerId: number;
  Gambler: IGambler;
  currencyCode: string;
  amount: BigNumber;
  lastBalanceUpdate: Date;
  needUpdateBalance: boolean;
  needUpdateUi: boolean;
  detail: IBalanceDetail;
}

export interface IBalanceProfileUi {
  amount: BigNumber;
  isUpdating: boolean;
  lastBalanceUpdate: Date;
}

export interface IBalanceUpdateAfterWork {
  GamblerId: number;
  currencyCode: string;
  remainingAmount: BigNumber;
  BalanceChangeId: number;
}
