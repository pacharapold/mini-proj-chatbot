import { ProviderAccount } from '@common/type/ProviderAccount.model';

export default {
  async findProviderAcctOfGm(GamblerId: number) {
    return await ProviderAccount.findOne({ where: { GamblerId } });
  },
};
