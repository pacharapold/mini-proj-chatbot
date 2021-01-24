import { WithdrawRequestAction } from '@common/enum/WithdrawRequestAction.enum';
import { WithdrawRequestStatus } from '@common/enum/WithdrawRequestStatus.enum';
import { IGamblerProfile } from '@common/type/Gambler.interface';
import {
  IGamblerBankAccount,
  IGamblerBankAccountProfileUi,
} from '@common/type/GamblerBankAccount.interface';
import { IOperator, IOperatorProfile } from '@common/type/Operator.interface';
import { IWork } from '@common/type/Work.interface';
import { Pagination } from '@common/util/Page';
import BigNumber from 'bignumber.js';

export type WithdrawRequestDetailType =
  | WithdrawRequestDetail
  | WithdrawRequestDetailReject
  | WithdrawRequestDetailAuto
  | IWithdrawRequestRetryDetail
  | {};
export interface IWithdrawRequest {
  id: number;
  workImiId: number;
  workImi: IWork;
  workBankId: number;
  workBank: IWork;
  reserve: boolean;
  reserveOperatorId: number;
  reserveOperator: IOperator;
  reserveTstamp: Date;
  approveStatus: WithdrawRequestAction;
  approverId: number;
  approver: IOperator;
  status: WithdrawRequestStatus;
  GamblerBankAccountId: number;
  GamblerBankAccount: IGamblerBankAccount;
  tstamp: Date;
  executed: boolean;
  amount: BigNumber;
  beforeBalance: BigNumber;
  afterBalance: BigNumber;
  detail: WithdrawRequestDetailType;
}

export interface WithdrawRequestDetail {
  remark: string;
}

export interface IWithdrawRequestCreate {
  workImiId: number;
  approveStatus: WithdrawRequestAction;
  status: WithdrawRequestStatus;
  GamblerBankAccountId: number;
  tstamp: Date;
  amount: BigNumber;
  detail: WithdrawRequestDetailType;
  reserve?: boolean;
  reserveOperatorId?: number;
  reserveTstamp?: Date;
  approverId?: number;
}

export interface IWithdrawRequestOperatorReserve {
  id: number;
  reserve: boolean;
}

export interface IWithdrawRequestOperatorAction {
  id: number;
  approveStatus: WithdrawRequestAction;
}

export interface IWithdrawRequestSearch {
  pagination: Pagination;
  reserve: boolean;
  reserveOperatorText: string;
  approverText: string;
  gamblerText: string;
  approveStatus: WithdrawRequestAction;
  status: WithdrawRequestStatus;
  startDate: string;
  endDate: string;
  executed: boolean;
}

export interface IWithdrawRequestSearchResult {
  id: number;
  workImiId: number;
  workBankId: number | null;
  reserve: boolean;
  reserveOperatorId: number | null;
  reserveOperator: IOperatorProfile | null;
  reserveTstamp: Date | null;
  approveStatus: WithdrawRequestAction;
  approverId: number | null;
  approver: IOperatorProfile | null;
  status: WithdrawRequestStatus;
  GamblerBankAccountId: number;
  GamblerBankAccount: IGamblerBankAccountProfileUi;
  GamblerId: number;
  Gambler: IGamblerProfile;
  tstamp: Date;
  executed: boolean;
  amount: BigNumber;
  beforeBalance: BigNumber;
  afterBalance: BigNumber;
}

export interface IWithdrawRequestDetailResult {
  id: number;
  workImiId: number;
  workImi: IWork;
  workBankId: number | null;
  workBank: IWork | null;
  reserve: boolean;
  reserveOperatorId: number | null;
  reserveOperator: IOperatorProfile | null;
  reserveTstamp: Date | null;
  approveStatus: WithdrawRequestAction;
  approverId: number | null;
  approver: IOperatorProfile | null;
  status: WithdrawRequestStatus;
  GamblerBankAccountId: number;
  GamblerBankAccount: IGamblerBankAccountProfileUi;
  GamblerId: number;
  Gambler: IGamblerProfile;
  tstamp: Date;
  executed: boolean;
  amount: BigNumber;
  beforeBalance: BigNumber;
  afterBalance: BigNumber;
  detail: WithdrawRequestDetailType;
}

export interface WithdrawRequestDetailReject {
  imiDepositWorkId: number;
}

export interface WithdrawRequestDetailAuto {
  NomineeBankAccountId: number;
  fromAccountNo: string;
  fromBankCode: string;
  toAccountNo: string;
  toBankCode: string;
}

export interface WithdrawRequestDetailManual {
  slip: string;
}

export interface IWithdrawRequestConfirmManual {
  id: number;
  slip: string;
  OperatorId: number;
}

export interface IWithdrawRequestRetry {
  id: number;
}

export interface IWithdrawRequestRetryDetail {
  retryOperatorId: number;
}

export interface IWithdrawRequestCancelable {
  pagination: Pagination;
  text: string;
}
