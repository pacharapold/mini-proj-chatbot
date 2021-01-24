import { Commission } from '@common/type/Commission.model';

export default {
  async findOneByIdAndGamblerId(id: number, GamblerId: number) {
    return await Commission.findOne({
      where: {
        GamblerId,
        id,
      },
    });
  },
};
