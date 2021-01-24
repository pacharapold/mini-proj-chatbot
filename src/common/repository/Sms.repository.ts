import { Sms } from '@common/type/Sms.model';

export default {
  async findById(id: number) {
    return await Sms.findByPk(id);
  },
};
