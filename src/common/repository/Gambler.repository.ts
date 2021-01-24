import {
  IGamblerTelNoLogin,
  IGamblerUsernameLogin,
} from '@common/type/Gambler.interface';
import { Gambler } from '@common/type/Gambler.model';

export default {
  async findByUsername(username: string) {
    return await Gambler.findOne({ where: { username } });
  },
  async findById(id: number) {
    return await Gambler.findByPk(id);
  },
  async findByTelNo(telNo: string) {
    return await Gambler.findOne({ where: { telNo } });
  },
  async findByUsernameAndSite({ username, site }: IGamblerUsernameLogin) {
    return await Gambler.findOne({ where: { username, site } });
  },
  async findByTelNoAndSite({ telNo, site }: IGamblerTelNoLogin) {
    return await Gambler.findOne({ where: { telNo, site } });
  },
};
