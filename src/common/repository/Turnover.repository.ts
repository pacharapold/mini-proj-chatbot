import { Turnover } from '@common/type/Turnover.model';

export default {
  async findTurnover(GamblerId: number) {
    return await Turnover.findOne({
      where: {
        GamblerId,
      },
    });
  },
};
