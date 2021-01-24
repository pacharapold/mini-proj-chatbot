import { ConfigTopic } from '@common/enum/ConfigTopic.enum';
import { Promotion } from '@common/enum/Promotion.enum';
import { UiType } from '@common/enum/UiType.enum';
import { IPromotionConfig } from '@common/type/Promotion.interface';
import BigNumber from 'bignumber.js';

export interface IConfig {
  id: number;
  topic: ConfigTopic | Promotion;
  detail: IConfigDetail;
  updatedAt: Date;
}

export interface IConfigNew {
  topic: ConfigTopic | string;
  detail: IConfigDetail;
}

export interface ISiteConfigCreate {
  site: string;
  config: ISiteConfig;
}

export interface ISiteConfigUpdate {
  site: string;
  key: string;
  value: number | string | boolean | BigNumber;
}

export interface IConfigUpdate {
  topic: ConfigTopic;
  detail: IConfigDetail;
}

export interface IDefaultConfigUpdate {
  topic: ConfigTopic;
  value: string | number | boolean;
}

export interface IUIConfigUpdate {
  version: string;
  site: string;
}

export interface IConfigResultFront {
  minimumDeposit: BigNumber;
  minimumWithdraw: BigNumber;
  maximumWithdrawAuto: BigNumber;
  maximumWithdrawCount: number;
  maximumWithdrawAmountPerTime: BigNumber;
  maximumWithdrawAmountPerDay: BigNumber;
  withdrawTurnoverTimes: number;
  withdrawTurnoverAutoValidation: boolean;
  announcement: string;
}

export interface IDefaultConfigResult {
  topic: ConfigTopic | Promotion;
  value: string | number | boolean | string[];
}

export type IUIConfig = {
  front: { version: string };
  office: { version: string };
};

export type IDefaultConfig = {
  value: string | number | boolean | string[];
};

export type IAgentDetail = {
  username: string;
  password: string;
  key: string;
};

export type ISiteConfig = {
  minimumDepositAmount: BigNumber;
  minimumWithdrawAmount: BigNumber;
  maximumWithdrawCount: number;
  maximumWithdrawAuto: BigNumber;
  maximumWithdrawAmountPerTime: BigNumber;
  maximumWithdrawAmountPerDay: BigNumber;
  withdrawTurnoverTime: number;
  withdrawTurnoverAutoValidation: boolean;
  announcement: string;
  uiVersion: string;
  lineRegisterMessage: string;
  usernamePrefix: string;
  siteUrl: string;
  apiUrl: string;
};

export interface ISiteApplyToAll {
  sites: string[];
}

export type IConfigDetail =
  | IUIConfig
  | IDefaultConfig
  | IPromotionConfig
  | ISiteConfig;
