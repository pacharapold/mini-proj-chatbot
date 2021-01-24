import { ChannelType } from '@common/enum/ChannelType.enum';
import { PuppeteerChannel } from '@common/type/PuppeteerChannel.model';

export const findChannelByIpAddress = async (ipAddress: string) => {
  return await PuppeteerChannel.findOne({ where: { ipAddress, active: true } });
};

export const findPuppeteerChannelByType = async (type: ChannelType) => {
  return await PuppeteerChannel.findAll({ where: { type } });
};
