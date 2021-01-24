import { ChannelType } from '@common/enum/ChannelType.enum';
import { TxType } from '@common/enum/TxType.enum';
import { Pagination } from '@common/util/Page';

export interface IPuppeteerChannel {
  id: number;
  ipAddress: string;
  owner: string;
  subOwner: string;
  active: boolean;
  type: ChannelType;
}

export interface IPuppeteerChannelCreate {
  ipAddress: string;
  owner: string;
  subOwner: string;
  active?: boolean;
  type: ChannelType;
}

export interface IPuppeteerChannelUpdate {
  puppeteerChannelId: number;
  active: boolean;
}

export interface IPuppeteerChannelSearch {
  pagination: Pagination;
  text: string;
  active: boolean;
}

export interface IPuppeteerChannelBotWorkUi {
  status?: boolean;
  ipAddress?: string;
  name: string;
  subName: string;
  queueLeft?: number | null;
  currentWork?: TxType | null;
  currentWorkTime?: Date | null;
  lastWork?: TxType | null;
  lastWorkTime?: Date | null;
  auto: boolean;
  sequence: number;
}
