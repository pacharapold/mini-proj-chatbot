import { ChannelType } from '@common/enum/ChannelType.enum';
import { PuppeteerChannel } from '@common/type/PuppeteerChannel.model';

export default {
  async findActiveBankByIpAddress(ipAddress: string) {
    return await PuppeteerChannel.findOne({
      where: { ipAddress, active: true, type: ChannelType.BANK },
    });
  },
};
