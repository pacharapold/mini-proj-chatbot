import { ProviderTransferAction } from '@common/enum/ProviderTransferAction.enum';
import { ProviderTransferStatus } from '@common/enum/ProviderTransferStatus.enum';
import { TxType } from '@common/enum/TxType.enum';
import { IBalanceChange } from '@common/type/BalanceChange.interface';
import { IDetailTxReportWork } from '@common/type/DetailTxReport.interface';
import { IGambler } from '@common/type/Gambler.interface';
import { IGamblerBankAccountNameRetrieve } from '@common/type/GamblerBankAccount.interface';
import {
  INomineeBankAccountRefreshBalanceReport,
  INomineeBankAccountRefreshDetailWork,
} from '@common/type/NomineeBankAccount.interface';
import {
  IBankWorkReport,
  IFiatWithdrawResult,
  IFiatWithdrawWork,
} from '@common/type/Work.Bank.interface';
import {
  ITransferResult,
  ITransferWork,
} from '@common/type/Work.Provider.interface';
import { Pagination } from '@common/util/Page';
import BigNumber from 'bignumber.js';

export type IProviderWork = ITransferWork;
export type IProviderResult = ITransferResult;
export type IBankWork =
  | IFiatWithdrawWork
  | IDetailTxReportWork
  | INomineeBankAccountRefreshDetailWork;
export type IBankResult = IFiatWithdrawResult;

export interface IWork {
  id: number;
  type: TxType;
  owner?: string;
  subOwner?: string;
  currencyCode?: string;
  detail?: IProviderWork | IBankWork;
  result?:
    | IProviderResult
    | IBankResult
    | INomineeBankAccountRefreshBalanceReport;
  createTstamp?: Date;
  completed?: boolean;
  completedTstamp?: Date;
  executed?: boolean;
  executedTstamp?: Date;
  BalanceChangeId?: number;
  BalanceChange?: IBalanceChange;
  seq?: Date;
  GamblerId?: number;
  Gambler?: IGambler;
  image?: string;
  report?: IBankWorkReport;
  gamblerBankAccounts?: IGamblerBankAccountNameRetrieve[];
}

export interface IWorkCreateDeposit {
  type: TxType;
  currencyCode: string;
  detail: IProviderWork | IBankWork;
  BalanceChangeId: number;
  GamblerId: number;
  agentUserName: string;
}

export interface IWorkSearch {
  pagination: Pagination;
  owner: string;
  subOwner: string;
  startDate: string;
  endDate: string;
  status: ProviderTransferStatus;
  action: ProviderTransferAction;
  executed: boolean;
  text: string;
  type: TxType;
}
export interface IWorkSearchResult {
  id: number;
  type: TxType;
  owner: string;
  subOwner: string;
  createTstamp: Date;
  statusWork: string;
  tstampWork?: Date;
  statusExecute: string;
  tstampExecute?: Date;
  statusResult: ProviderTransferStatus;
}

export interface IWorkBankWithdraw {
  amount: BigNumber;
  currencyCode: string;
  GamblerId: number;
  NomineeBankAccountId: number;
  BalanceChangeId: number;
}
