import { BalanceChange } from '@common/type/BalanceChange.model';

export default {
  async findById(id: number) {
    return await BalanceChange.findByPk(id);
  },
};
