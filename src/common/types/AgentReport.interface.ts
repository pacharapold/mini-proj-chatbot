import { IAgentDetail } from '@common/type/Config.interface';
import { CurrentCreditResponse } from '@common/type/ImiApi.interface';
import { Pagination } from '@common/util/Page';
import BigNumber from 'bignumber.js';

export interface IAgentReportRequest {
  pagination: Pagination;
  agent: IAgentDetail;
  startDate: string;
  endDate: string;
}

export interface IAgentReportSearchBySite {
  agentUsername: string;
  pagination: Pagination;
  startDate: string;
  endDate: string;
}

export interface IAgentReportSearch {
  pagination: Pagination;
  agentUsername: string;
  site: string;
  startDate: string;
  endDate: string;
}

export interface IAgentReportSearchResult {
  username: string;
  turnover: BigNumber;
  validAmount: BigNumber;
  playerDetail: IDetailAgentReport;
  agentDetail: IDetailAgentReport;
  masterDetail?: IDetailAgentReport;
  srDetail?: IDetailAgentReport;
  company: BigNumber;
}

export interface IAgentReportSummary {
  turnover: BigNumber;
  validAmount: BigNumber;
  playerDetail: IDetailAgentReport;
  agentDetail: IDetailAgentReport;
  masterDetail?: IDetailAgentReport;
  srDetail?: IDetailAgentReport;
  company: BigNumber;
}

export interface IDetailAgentReport {
  win: BigNumber;
  commission: BigNumber;
  loyalty: BigNumber;
  total: BigNumber;
}

export interface IAgentMember {
  Id: number;
  CompanyId: number;
  Username: string;
  Email: string;
  IsSafeCodeEnabled: boolean;
  LastLoginTime: string;
  LastLoginIP: string;
  LastLoginServerID: string;
  NeedDelete: boolean;
  AccountType: string;
  Lang: string;
  TimeZone: string;
  Currency: string;
  Suspended: boolean;
  Actived: boolean;
  VIPID: number;
  UplinkID: number;
  AdminID: number;
  Role: number;
  CreatedTime: string;
  CreatedTimeText: string;
  UpdatedTime: string;
  UpdatedTimeText: string;
  Phone: string;
  Status: number;
  PowerId: number;
  UsedCredit: number;
  Balance: number;
  IsSub: boolean;
  SubOwner: number;
  MultiCurrency: boolean;
  UtcCreatedTime: string;
  UtcUpdatedTime: string;
  UtcLastLoginTime: string;
  CreditLimit: number;
  FullName: string;
  Gender: number;
  Remark?: any;
  IsAffiliate: boolean;
  Level: number;
  Extra1: string;
  Extra2: string;
  CashMode: boolean;
}

export interface IAgentCurrentCreditResult {
  site: string;
  agentCreditResult: IAgentCredit[];
}

export interface IAgentCredit {
  agentUsername: string;
  result: CurrentCreditResponse;
}
