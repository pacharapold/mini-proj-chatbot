import { TxType } from '@common/enum/TxType.enum';
import {
  IBalanceChange,
  IBalanceChangeFilterResult,
} from '@common/type/BalanceChange.interface';
import { INomineeBankAccount } from '@common/type/NomineeBankAccount.interface';
import { IOperator } from '@common/type/Operator.interface';
import { ISms } from '@common/type/Sms.interface';
import BigNumber from 'bignumber.js';

export interface IBankMsg {
  id: number;
  type: TxType;
  tstamp: Date;
  fromBankCode: string;
  fromAccountNo: string;
  toBankCode: string;
  toAccountNo: string;
  amount: BigNumber;
  remainingAmount: BigNumber;
  executed: boolean;
  BalanceChangeId: number;
  BalanceChange: IBalanceChange;
  SmsId: number;
  Sms: ISms;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  NomineeBankAccountId: number;
  NomineeBankAccount: INomineeBankAccount;
  OperatorId: number;
  Operator: IOperator;
}

export interface IBankMsgCreate {
  type: TxType;
  tstamp: Date;
  fromBankCode: string | null;
  fromAccountNo: string | null;
  toBankCode: string | null;
  toAccountNo: string | null;
  amount: BigNumber | null;
  remainingAmount: BigNumber | null;
  SmsId: number;
  NomineeBankAccountId: number | null;
}

export interface IBankMsgBay {
  type: TxType;
  tstamp: string;
  fromBankCode: string;
  fromAccountNo: string;
  toBankCode: string;
  toAccountNo: string;
  amount: string;
}

export interface IBankMsgUndoneFilter {
  NomineeBankAccountId: number;
}

export interface IBankMsgExecuteDeposit {
  GamblerId: number;
  BankMsgId: number;
}
export interface IBankMsgHide {
  BankMsgId: number;
}

export interface IBankMsgDepositList {
  id: number;
  type: TxType;
  tstamp: Date;
  fromBankCode: string;
  fromAccountNo: string;
  toBankCode: string;
  toAccountNo: string;
  amount: BigNumber;
  remainingAmount: BigNumber;
  executed: boolean;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  BalanceChange: IBalanceChangeFilterResult;
  Sms: ISms;
  NomineeBankAccount: INomineeBankAccount;
  Operator: IOperator;
}
