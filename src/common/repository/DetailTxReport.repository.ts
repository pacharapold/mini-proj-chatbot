import { DetailTxReport } from '@common/type/DetailTxReport.model';
import { FindOptions } from 'sequelize';

export default {
  async findOneWithCondition(condition: FindOptions) {
    return DetailTxReport.findOne(condition);
  },
  async findById(id: number) {
    return DetailTxReport.findByPk(id);
  },
};
