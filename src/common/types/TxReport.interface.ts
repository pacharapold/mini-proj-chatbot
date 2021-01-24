import {
  INomineeBankAccount,
  INomineeBankAccountSearchResult,
} from '@common/type/NomineeBankAccount.interface';
import { Pagination } from '@common/util/Page';
import { Moment } from 'moment';

export interface ITxReport {
  id: number;
  statementDate: Date;
  fromTstamp: Date;
  toTstamp: Date;
  completed: boolean;
  NomineeBankAccountId: number;
  NomineeBankAccount: INomineeBankAccount;
}

export interface ITxReportCreate {
  statementDate: Date | Moment | string;
  NomineeBankAccountId: number;
}

export interface ITxReportSearch {
  completed: true;
  startDate: string;
  endDate: string;
  pagination: Pagination;
  NomineeBankAccountId: number;
}

export interface ITxReportSearchResult {
  id: number;
  statementDate: Date;
  fromTstamp: Date;
  toTstamp: Date;
  completed: boolean;
  NomineeBankAccountId: number;
  NomineeBankAccount: INomineeBankAccountSearchResult;
}
