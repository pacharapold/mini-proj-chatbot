import { AccountType } from '@common/enum/AccountType.enum';
import { INominee } from '@common/type/Nominee.interface';
import { Pagination } from '@common/util/Page';
import BigNumber from 'bignumber.js';

export interface INomineeBankAccount {
  id: number;
  bankCode: string;
  accountNo: string;
  active: boolean;
  type: AccountType;
  username: string;
  password: string;
  smsTelNo: string;
  lastBalance: BigNumber;
  lastBalanceUpdate: Date;
  NomineeId: number;
  Nominee: INominee;
  sequence: number;
  auto: boolean;
}

export interface INomineeBankAccountQuery {
  bank_code: string;
  account_no: string;
  type: AccountType;
  sms_tel_no: string;
  last_balance: BigNumber;
  last_balance_update: Date;
  ip_address: string;
  active: boolean;
  nominee_bank_account_id: number;
  puppeteer_channel_id: number;
  sequence: number;
  auto: boolean;
}

export interface INomineeBankAccountCreate {
  NomineeId: number;
  bankCode: string;
  accountNo: string;
  type: AccountType;
  username: string | null;
  password: string | null;
  smsTelNo: string;
  sequence: number;
  auto?: boolean;
  lastBalance: number;
}

export interface INomineeBankAccountUpdateStatus {
  NomineeBankAccountId: number;
  active: boolean;
}

export interface INomineeBankAccountUpdateAuto {
  NomineeBankAccountId: number;
  auto: boolean;
}

export interface INomineeBankAccountSearch {
  pagination: Pagination;
  text: string;
  bankCode: string;
  active: boolean;
  type: AccountType;
  auto: boolean;
  sequence: number;
  NomineeId: number;
  trueWallet: boolean;
}

export interface INomineeBankAccountSearchResult {
  id: number;
  lastBalance: BigNumber;
  lastBalanceUpdate: Date;
  bankCode: string;
  accountNo: string;
  active: boolean;
  type: AccountType;
  hasUsername: boolean;
  hasPassword: boolean;
  smsTelNo: string;
  auto: boolean;
  sequence: number;
  Nominee: {
    id: number;
    accountName: string;
    telNo: string;
    alias: string;
  };
}

export interface INomineeBankAccountRequestLogin {
  ipAddress: string;
  type: AccountType;
}

export interface INomineeBankAccountLogin {
  credentialPassword: string;
  credentialLogin: string;
  accountNo: string;
  accountBank: string;
  accountName: string;
  type: AccountType;
}

export interface INomineeBankAccountUpdateBalance {
  bankCode: string;
  accountNo: string;
  lastBalance: BigNumber;
  lastBalanceUpdate: Date;
}

export interface INomineeBankAccountUpdateBalanceById {
  id: number;
  lastBalance: BigNumber;
  lastBalanceUpdate: Date;
}

export interface INomineeBankAccountHiddenBankAccountSearch {
  bankCode: string;
  hiddenAccountNo: string;
  type: AccountType[];
}

export interface INomineeBankAccountFind {
  bankCode: string;
  accountNo: string;
}

export interface INomineeBankAccountFindType extends INomineeBankAccountFind {
  type: AccountType[];
}

export interface INomineeBankAccountRefreshBalance {
  id: number;
}

export interface INomineeBankAccountRefreshDetailWork {
  bankCode: string;
  accountNo: string;
  type?: AccountType;
}

export interface INomineeBankAccountRefreshBalanceReport {
  WorkId: number;
  accountNo: string;
  balance: BigNumber;
  updatedTstamp: Date;
}

export interface ITrueWalletAccountCreate {
  NomineeId: number;
  sequence: number;
  lastBalance: BigNumber;
  telNo: string;
}
