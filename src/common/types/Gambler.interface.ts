import BigNumber from 'bignumber.js';

export interface IGambler {
  id: number;
  userId: string;
  username: string;
  balance: BigNumber;
  lastBalanceUpdate: Date;
  createdAt: Date;
}
