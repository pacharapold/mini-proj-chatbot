import { ProviderTransferStatus } from '@common/enum/ProviderTransferStatus.enum';
import { ProviderTransferAction } from '@common/enum/ProviderTransferAction.enum';
import BigNumber from 'bignumber.js';

export interface ITransferWork {
  providerCode: string;
  localId?: string;
  username: string;
  currencyCode: string;
  amount: BigNumber;
}

export interface ITransferResult {
  status: ProviderTransferStatus;
  transferAmount?: BigNumber;
  errorCode?: string;
  errorMsg?: string;
  action: ProviderTransferAction;
  remainingAmount?: BigNumber;
  transactionId?: string;
  transactionTStamp?: Date;
}
