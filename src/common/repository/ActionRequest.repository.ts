import { ActionRequest } from '@common/type/ActionRequest.model';

export default {
  async findById(id: number) {
    return await ActionRequest.findByPk(id);
  },
};
