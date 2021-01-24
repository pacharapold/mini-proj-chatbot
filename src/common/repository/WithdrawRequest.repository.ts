import { WithdrawRequest } from '@common/type/WithdrawRequest.model';

export default {
  async findById(id: number) {
    return await WithdrawRequest.findByPk(id);
  },
};
