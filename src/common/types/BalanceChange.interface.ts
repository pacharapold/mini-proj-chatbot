import { BalanceChangeUiType } from '@common/enum/BalanceChangeUiType.enum';
import { DepositFromType } from '@common/enum/DepositFromType.enum';
import { Promotion } from '@common/enum/Promotion.enum';
import { TxType } from '@common/enum/TxType.enum';
import { WorkStatus } from '@common/enum/WorkStatus.enum';
import { IActionRequestWithdraw } from '@common/type/ActionRequest.interface';
import { IBalanceDetail } from '@common/type/Balance.interface';
import { ICommissionResult } from '@common/type/Commission.interface';
import { IGambler } from '@common/type/Gambler.interface';
import { ISmsDetail } from '@common/type/Sms.interface';
import { Pagination } from '@common/util/Page';
import BigNumber from 'bignumber.js';

export type IBalanceChangeDetail =
  | {}
  | ISmsDetail
  | IBalanceChangeWithdrawDetail
  | IBalanceChangeCancelWithdraw
  | IBalanceChangeActionRequest
  | IBalanceChangeActionRequestChangeCredit
  | IBalanceChangeWithdrawRequest
  | ICommissionResult;

export interface IBalanceChange {
  id: number;
  GamblerId: number;
  Gambler: IGambler;
  type: TxType;
  currencyCode: string;
  amountBefore: BigNumber;
  amount: BigNumber;
  amountAfter: BigNumber;
  tstamp: Date;
  status: WorkStatus;
  details: IBalanceChangeDetail;
}

export interface IBalanceChangeCreate {
  GamblerId: number;
  currencyCode: string;
  amountChange: BigNumber;
  type: TxType;
  tstamp: Date;
  status: WorkStatus;
  detail: IBalanceDetail | IBalanceChangeDetail;
}

export interface IBalanceChangeFilter {
  pagination: Pagination;
  text?: string; // (gambler) telNo
  type?: TxType;
  startDate?: string;
  endDate?: string;
}

export interface IBalanceChangeFilterResult {
  id: number;
  username: string;
  telNo: string;
  type: TxType;
  amountBefore: BigNumber;
  amount: BigNumber;
  amountAfter: BigNumber;
  tstamp: Date;
  status: WorkStatus;
  site: string;
}

export interface IBalanceChangeDeposit {
  BankMsgId: number;
  amount: BigNumber;
  fromBankCode: string;
  fromAccountNo: string;
  NomineeBankAccountId: number;
}

export interface IBalanceChangeWithdraw {
  GamblerId: number;
  amount: BigNumber;
  currencyCode: string;
}

export interface IBalanceChangeWithdrawDetail {
  sourceBankCode?: string;
  sourceAccountNo?: string;
  destinationBankCode: string;
  destinationAccountNo: string;
  destinationAccountName: string;
  amount: BigNumber;
  username: string;
  actionRequestDetail?: IActionRequestWithdraw;
}

export interface IBalanceChangeDetailUi {
  toBank?: { bankCode: string; accountNo: string };
  fromBank?: { bankCode: string; accountNo: string };
  promotionName?: Promotion;
  action?: BalanceChangeUiType;
  promotionPaid?: string;
}

export interface IBalanceChangeUi {
  id: number;
  type: TxType;
  currencyCode: string;
  amountBefore: BigNumber;
  amount: BigNumber;
  amountAfter: BigNumber;
  tstamp: Date;
  status: WorkStatus;
  details: IBalanceChangeDetailUi;
}

export interface IBalanceChangeCancelWithdraw {
  BalanceChangeId: number;
  WorkId: number;
  amount: BigNumber;
  reason?: string;
}

export interface IBalanceChangeActionRequest {
  amount: BigNumber;
  sourceBankCode: string;
  sourceAccountNo: string;
  transferTstamp: Date;
  source?: DepositFromType;
  sourceId?: number;
  ActionRequestId: number;
}

export interface IBalanceChangeActionRequestChangeCredit {
  amount: BigNumber;
  ActionRequestId: number;
}

export interface IBalanceChangeWithdrawRequest {
  WithdrawRequestId: number;
}

export interface IBalanceChangeSummaryOption {
  GamblerId: number;
  startDate: Date;
  endDate: Date;
  type: TxType;
}

export interface IBalanceChangeSearchBySite {
  pagination: Pagination;
  text?: string; // (gambler) telNo
  type?: TxType;
  startDate?: string;
  endDate?: string;
  imiUsername?: string;
}

export interface IBalanceChangeSearchBySiteResult {
  id: number;
  username: string;
  telNo: string;
  type: TxType;
  amountBefore: BigNumber;
  amount: BigNumber;
  amountAfter: BigNumber;
  tstamp: Date;
  status: WorkStatus;
  site: string;
  gameAccount: string | null;
}
