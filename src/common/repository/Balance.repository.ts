import { Balance } from '@common/type/Balance.model';

export default {
  async findBalance(GamblerId: number, currencyCode: string) {
    return await Balance.findOne({
      where: { GamblerId, currencyCode },
    });
  },
};
