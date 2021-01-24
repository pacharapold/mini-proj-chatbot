import { EC, Invalid } from '@common/error/Invalid.error';
import { ISmsDeviceNew } from '@common/type/SmsDevice.interface';
import { SmsDevice } from '@common/type/SmsDevice.model';

export default {
  async registerNewDevice(data: ISmsDeviceNew) {
    const { key, remark }: ISmsDeviceNew = data;
    const existDevice = await SmsDevice.findOne({ where: { key } });
    if (existDevice) throw Invalid.badRequest(EC.KEY_ALREADY_EXIST);
    await SmsDevice.create({ key, remark });
    return { result: true };
  },
  async findByKey(key: string) {
    return await SmsDevice.findOne({ where: { key } });
  },
};
