import BigNumber from 'bignumber.js';
import { IBankResult } from '@common/type/Work.interface';

export interface IFiatWithdrawWork {
  GamblerId: number;
  currencyCode: string;
  amount: BigNumber;
  ourBankCode: string;
  ourAccountNo: string;
  gamblerBankCode: string;
  gamblerAccountNo: string;
  gamblerAccountName?: string;
  gamblerUsername?: string;
}

export interface IFiatWithdrawResult {
  status: string;
  errorCode?: string;
  errorMsg?: string;
  transactionTstamp?: Date;
  referenceTx?: string;
  action?: string;
}

export type IBankWorkReport = {
  WorkId: number;
  providerCode?: string;
  currencyCode?: string;
  ipaddr?: string;
  result: IBankResult;
};
