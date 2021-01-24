import BigNumber from 'bignumber.js';
import { IGambler } from '@common/type/Gambler.interface';

export interface IPromotionNode {
  countNode: number;
  activeNode: number;
  sumValidAmount: BigNumber;
  payRate: number;
  promotionPaid: BigNumber;
}

export interface IAffiliate {
  id: number;
  dstamp: Date;
  GamblerId: number;
  Gambler: IGambler;
  validAmount: BigNumber;
  promotionEligible: boolean;
  promotionAmount: BigNumber;
  promotionDetail: Record<number, IPromotionNode>;
  expiredAt: Date;
  accepted: boolean;
  disbursed: boolean;
}
