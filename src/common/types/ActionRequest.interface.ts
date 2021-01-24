import { ActionRequestType } from '@common/enum/ActionRequestType.enum';
import { DepositFromType } from '@common/enum/DepositFromType.enum';
import {
  IBalanceChange,
  IBalanceChangeFilterResult,
} from '@common/type/BalanceChange.interface';
import { IGambler } from '@common/type/Gambler.interface';
import { IOperator, IOperatorProfile } from '@common/type/Operator.interface';
import { Pagination } from '@common/util/Page';
import BigNumber from 'bignumber.js';

export type IActionRequestDetail =
  | IActionRequestDetailDeposit
  | IActionRequestWithdraw
  | IActionRequestChangeCredit
  | IActionRequestOther
  | IActionRequestChangeWithdrawRequestCancel
  | {};

export interface IActionRequest {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  approvedAt: Date;
  type: ActionRequestType;
  executed: boolean;
  approved: boolean;
  requesterId: number;
  approverId: number;
  requester: IOperator;
  approver: IOperator;
  GamblerId: number;
  Gambler: IGambler;
  BalanceChangeId?: number;
  BalanceChange?: IBalanceChange;
  approveRemark: string;
  requestRemark: string;
  result?: string;
  detail: IActionRequestDetail;
}

export interface IActionRequestDetailDeposit {
  amount: BigNumber;
  accountNo: string;
  bankCode: string;
  transferTstamp: Date;
  slipImage: string;
  source?: DepositFromType;
  sourceId?: number;
}

export interface IActionRequestWithdraw {
  amount: BigNumber;
  accountNo: string;
  bankCode: string;
  BalanceChangeId: number;
}

export interface IActionRequestChangeCredit {
  amount: BigNumber;
}

export interface IActionRequestChangeWithdrawRequestCancel {
  WithdrawRequestId: number;
}

export interface IActionRequestOther {
  title: string;
  explain: string;
}

export interface IActionRequestCreate {
  // Common
  type: ActionRequestType;
  requestRemark: string;
  GamblerId: number;
  bankCode: string;
  accountNo: string;
  amount: BigNumber;
  // for deposit
  transferTstamp?: string | Date;
  source?: DepositFromType;
  sourceId?: number;
  slipImage?: string;
  // for withdraw
  BalanceChangeId?: number;
  // for other
  title?: string;
  explain?: string;
  WithdrawRequestId?: number;
}

export interface IActionRequestUpdate {
  id: number;
  approveRemark: string;
  approved: boolean;
}

export interface IActionRequestSearch {
  pagination: Pagination;
  startCreatedAt?: Date;
  endCreatedAt?: Date;
  startApprovedAt?: Date;
  endApprovedAt?: Date;
  type?: ActionRequestType;
  executed?: boolean;
  approved?: boolean;
  isApproved?: boolean;
  requesterId?: number;
  approverId?: number;
  GamblerId?: number;
  text?: string;
}

export interface IActionRequestSearchResult {
  id: number;
  createdAt: Date;
  type: ActionRequestType;
  requesterUsername: string;
  isApproved: boolean;
  approved: boolean;
  executed: boolean;
  Gambler: {
    username: string;
    telNo: string;
  };
}

export interface IActionRequestSearchDetail {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  approvedAt: Date;
  type: ActionRequestType;
  executed: boolean;
  approved: boolean;
  requesterId: number;
  approverId: number | null;
  requester: IOperatorProfile;
  approver: IOperatorProfile | null;
  Gambler: {
    username: string;
    telNo: string;
  };
  BalanceChangeId: number | null;
  BalanceChange: IBalanceChangeFilterResult | null;
  approveRemark: string | null;
  requestRemark: string | null;
  detail: IActionRequestDetail;
  result: string | null;
}

export interface IActionRequestUpdateResponse {
  id: number;
  createdAt: Date;
  type: ActionRequestType;
  requesterUsername: string;
  approverUsername: string;
  telNoGambler: string;
  executed: boolean;
  approved: boolean;
  approveRemark: string | null;
  requestRemark: string | null;
}

export interface IActionRequestTrueWalletCreate {
  GamblerId: number;
  amount: BigNumber;
  slipImage?: string;
  NomineeBankAccountId: number;
}

export interface IActionRequestTrueWalletDetail
  extends IActionRequestChangeCredit {
  NomineeBankAccountId: number;
  slipImage?: string;
}
