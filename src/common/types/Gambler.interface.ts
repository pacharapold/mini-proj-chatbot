import GamblerType from '@common/enum/GamblerType.enum';
import { Interval } from '@common/enum/Interval.enum';
import { SocialType } from '@common/enum/SocialType.enum';
import TelNoStatus from '@common/enum/TelNoStatus.enum';
import { IBalanceProfileUi } from '@common/type/Balance.interface';
import { IConfigResultFront } from '@common/type/Config.interface';
import { IGamblerBankAccountProfileUi } from '@common/type/GamblerBankAccount.interface';
import { ITurnoverUserProfileUI } from '@common/type/Turnover.interface';
import { Pagination } from '@common/util/Page';
import BigNumber from 'bignumber.js';

export interface IGambler {
  id: number;
  username: string;
  telNo: string;
  telNoStatus: TelNoStatus;
  type: GamblerType;
  password: string;
  refCode: string;
  hash: string;
  createdAt: Date;
  lastForgetPass: Date | null;
  lastChangePass: Date | null;
  refGamblerId: number;
  Gambler: IGambler;
  parent: IGambler;
  social: SocialType;
  site: string;
}

export interface IGamblerRegister {
  telNo: string;
  password: string;
  reference: string;
  bankCode: string;
  accountNo: string;
  accountName: string;
  social: SocialType;
  site?: string;
}

export interface IGamblerLogin {
  username: string;
  password: string;
  remember: boolean;
  impersonate: boolean;
}

export interface IGamblerForgetPassword {
  telNo: string;
}

export interface IGamblerChangePassword {
  oldPassword: string;
  newPassword: string;
}

export interface IGamblerFilter {
  pagination: Pagination;
  username?: string;
}

export interface IGamblerFilterResult {
  GamblerId: number;
  accountName: string;
  telNo: string;
  refCode: string;
  username: string;
  bankCode: string;
  accountNo: string;
}

export interface IGamblerProfile {
  id?: number;
  username: string;
  telNo: string;
  telNoStatus: TelNoStatus;
  type: GamblerType;
  refCode: string;
  createdAt?: Date;
  lastForgetPass?: Date | null;
  lastChangePass?: Date | null;
  site: string;
}

export interface IGamblerProfileUi {
  gambler: IGamblerProfile;
  parent: IGamblerProfile | null;
  balance: IBalanceProfileUi;
  withdrawCount: number;
  bankAccount: IGamblerBankAccountProfileUi;
  balanceChanges: any;
  configs: IConfigResultFront;
  promotions: any;
  hasAccount: boolean;
  turnover: ITurnoverUserProfileUI | null;
}

export interface IGamblerWithdraw {
  amount: BigNumber;
}

export interface IGamblerInfo {
  id: number;
  username: string;
  telNo: string;
  telNoStatus: TelNoStatus;
  type: GamblerType;
  password: string;
  refCode: string;
  createdAt: Date;
}

export interface IGamblerCreate {
  telNo: string;
  password: string;
  reference: string;
  bankCode: string;
  accountNo: string;
  accountName: string;
  social: SocialType;
  site: string;
  telNoStatus: string;
  otpCheck: boolean;
}

export interface IGamblerUsernameLogin {
  username: string;
  site: string;
}

export interface IGamblerTelNoLogin {
  telNo: string;
  site: string;
}

export interface IGamblerTxAction {
  depositTimes: number;
  deposit: BigNumber;
  withdrawTimes: number;
  withdraw: BigNumber;
}

export interface IGamblerSummaryTx {
  all: IGamblerTxAction;
  today: IGamblerTxAction;
  balance: BigNumber;
  profit?: boolean;
  profitAmount?: BigNumber;
}

export interface IGamblerReportFilter {
  site: string;
  pagination: Pagination;
}

export interface IGamblerReportResult {
  username: string;
  telNo: string;
  telNoStatus: TelNoStatus;
  type: GamblerType;
  refCode: string;
  createdAt: Date;
  lastForgetPass: Date | null;
  lastChangePass: Date | null;
  parentUsername: string | null;
  social: SocialType;
  site: string;
}

export interface IGamblerSearchBySiteResult {
  GamblerId: number;
  accountName: string;
  telNo: string;
  refCode: string;
  username: string;
  bankCode: string;
  accountNo: string;
  gameAccount: string | null;
}

export interface IGamblerSearchBySite {
  pagination: Pagination;
  username?: string;
  imiUsername?: string;
}
export interface IGamblerDashboardFilter {
  interval: Interval;
  site: string;
  startDate: string;
  endDate: string;
}

export interface IGamblerDashboardSocialFilter {
  site: string;
  startDate: string;
  endDate: string;
}

export interface IGamblerTopFilter extends IGamblerDashboardFilter {
  win: boolean;
  limit: number;
  target: string;
}
