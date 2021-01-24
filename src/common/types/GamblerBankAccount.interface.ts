import { IGambler } from '@common/type/Gambler.interface';
import { Pagination } from '@common/util/Page';

export interface IGamblerBankAccount {
  id: number;
  bankCode: string;
  accountNo: string;
  accountName: string;
  lockWithdraw: boolean;
  active: boolean;
  verifyName: string;
  accountNameRetrieved: boolean;
  GamblerId: number;
  Gambler: IGambler;
  autoDeposit: boolean;
  disabledDepositTstamp: Date;
  validateTurnover: boolean;
  sequence: number;
  decimal: number;
}

export interface IGamblerBankAccountCreate {
  bankCode: string;
  accountNo: string;
  accountName: string;
  sequence: number;
}

export interface IGamblerBankAccountUpdate {
  GamblerId: number;
  bankCode: string;
  accountNo: string;
  accountName: string;
}

export interface IGamblerBankAccountFilter {
  pagination: Pagination;
  text?: string; // accountNo AccountName accountNameRetrieved
  bankCode?: string;
  lockWithdraw?: boolean;
  active?: boolean;
  accountNameRetrieved?: boolean;
  autoDeposit?: boolean;
  validateTurnover?: boolean;
  accountNo: string;
}

export interface IGamblerBankAccountFilterResult {
  GamblerId: number;
  username: string;
  telNo: string;
  bankCode: string;
  accountNo: string;
  accountName: string;
  verifyName: string;
  lockWithdraw: boolean;
  active: boolean;
  autoDeposit: boolean;
  validateTurnover: boolean;
  disabledDepositTstamp: Date | null;
  accountNameRetrieved: boolean;
}

export interface IGamblerBankAccountLockWithdraw {
  GamblerId: number;
  lockWithdraw: boolean;
}

export interface IGamblerBankAccountProfileUi {
  id: number;
  bankCode: string;
  accountNo: string;
  accountName: string;
  lockWithdraw: boolean;
  active: boolean;
  verifyName: string;
  accountNameRetrieved: boolean;
}

export interface IGamblerBankAccountNameRetrieve {
  gmBankAccountId: number;
  toBankCode: string;
  toAccountNo: string;
  toAccountName: string;
  nameFromBank?: string;
}

export interface IGamblerBankAccountUpdateAutoDeposit {
  GamblerId: number;
  autoDeposit: boolean;
}

export interface IGamblerBankAccountUpdateValidateTurnover {
  GamblerId: number;
  validateTurnover: boolean;
}

export interface IGamblerBankAccountUpdateDepositSequence {
  accountNo: string;
  bankCode: string;
  isUpdate: boolean;
}

export interface IGamblerBankAccountUpdateAccountNameRetrieved {
  GamblerId: number;
  accountNameRetrieved: boolean;
}

export interface IGamblerBankAccountSearchBySiteResult {
  GamblerId: number;
  username: string;
  telNo: string;
  bankCode: string;
  accountNo: string;
  accountName: string;
  verifyName: string;
  lockWithdraw: boolean;
  active: boolean;
  autoDeposit: boolean;
  validateTurnover: boolean;
  disabledDepositTstamp: Date | null;
  accountNameRetrieved: boolean;
  gameAccount: string | null;
}
