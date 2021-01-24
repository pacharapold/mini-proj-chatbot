import { AccountType } from '@common/enum/AccountType.enum';
import { IBalanceChange } from '@common/type/BalanceChange.interface';
import {
  INomineeBankAccount,
  INomineeBankAccountSearchResult,
} from '@common/type/NomineeBankAccount.interface';
import { IOperator, IOperatorProfile } from '@common/type/Operator.interface';
import { Pagination } from '@common/util/Page';
import BigNumber from 'bignumber.js';
import { Moment } from 'moment';

export interface IDetailTxReport {
  id: number;
  type: AccountType;
  executed: boolean;
  tstamp: Date;
  txType: string;
  amount: BigNumber;
  remainingBalance: BigNumber;
  serviceChannel: string;
  note: string;
  remark: string;
  BalanceChangeId: number;
  BalanceChange: IBalanceChange;
  OperatorId: number;
  Operator: IOperator;
  NomineeBankAccountId: number;
  NomineeBankAccount: INomineeBankAccount;
}

export interface IDetailTxReportCreateWork {
  NomineeBankAccountId: number;
  statementDate: Date | Moment | string;
}

export interface IDetailTxReportWork {
  statementDate: Date;
  fromTstamp: Date;
  toTstamp: Date;
  type?: AccountType;
  accountNo: string;
  bankCode: string;
  NomineeBankAccountId?: number;
}

export interface IDetailTxReportResult {
  statementDate: Date;
  owner: string;
  subOwner: string;
  finished: boolean;
  transactions: IDetailTxReportResultRaws[];
}

export interface IDetailTxReportResultRaws {
  date: string;
  txType: string;
  withdrawal: string | null;
  deposit: string | null;
  outstandingBalance: string | null;
  serviceChannel: string | null;
  note: string | null;
}

export interface IDetailTxReportSearch {
  pagination: Pagination;
  startDate: string;
  endDate: string;
  type: AccountType;
  haveBalanceChange: boolean;
  NomineeBankAccountId: number;
}

export interface IDetailTxReportSearchResult {
  id: number;
  type: AccountType;
  executed: boolean;
  tstamp: Date;
  txType: string;
  amount: BigNumber;
  remainingBalance: BigNumber;
  serviceChannel: string;
  note: string;
  remark: string;
  BalanceChangeId: number | null;
  BalanceChange: IBalanceChange | null;
  OperatorId: number | null;
  Operator: IOperatorProfile | null;
  NomineeBankAccountId: number;
  NomineeBankAccount: INomineeBankAccountSearchResult;
}

export interface IDetailTxReportUpdate {
  id: number;
  remark: string;
  BalanceChangeId: number;
}

export interface IDetailTxReportSearchNotMatch {
  type: AccountType;
  amount: BigNumber;
  startDate: string;
  endDate: string;
  pagination: Pagination;
  text: string;
}
