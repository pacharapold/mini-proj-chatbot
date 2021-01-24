import { ISmsDevice } from '@common/type/SmsDevice.interface';
import { Pagination } from '@common/util/Page';
import BigNumber from 'bignumber.js';

export interface ISms {
  id: number;
  SmsDeviceId: number;
  SmsDevice: ISmsDevice;
  senderName: string;
  msg: string;
  tstamp: Date;
  readable: boolean;
  executed: boolean;
}

export interface ISmsReceive {
  smsDevice: string;
  sender: string;
  message: string;
  uuid: string;
  timestamp: number;
}

export interface ISmsDetail {
  sourceBankCode: string;
  sourceAccountNo: string;
  destinationBankCode: string;
  destinationAccountNo: string;
  amount: BigNumber;
}
export interface ISmsFilter {
  pagination: Pagination;
  text: string; // sender, msg
  startDate: string;
  endDate: string;
  executed: boolean;
  smsDeviceId: number;
  readable: boolean;
}

export interface ISmsFilterResult {
  id: number;
  SmsDevice: ISmsDevice;
  senderName: string;
  msg: string;
  tstamp: Date;
  readable: boolean;
  executed: boolean;
}

export interface ISmsCheckSmsForwarderStatus {
  NomineeBankAccountId: number;
}
