import { ProviderAccount } from '@common/type/ProviderAccount.model';
import { Op } from 'sequelize';

export default {
  async findByGamblerId(GamblerId: number) {
    return await ProviderAccount.findOne({ where: { GamblerId } });
  },
  async findByUsername(username: string) {
    return await ProviderAccount.findOne({ where: { username } });
  },
  async findAllByUsername(username: string) {
    return await ProviderAccount.findAll({
      where: { username: { [Op.substring]: username } },
    });
  },
  async findAllByGamblerIds(GamblerIds: number[]) {
    return await ProviderAccount.findAll({
      where: { GamblerId: { [Op.in]: GamblerIds } },
    });
  },
};
