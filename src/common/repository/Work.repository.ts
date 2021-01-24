import { BalanceChange } from '@common/type/BalanceChange.model';
import { Gambler } from '@common/type/Gambler.model';
import { Work } from '@common/type/Work.model';
import { FindOptions } from 'sequelize';

export default {
  async findById(id: number) {
    return await Work.findByPk(id);
  },
  async findByIdWithAssociation(id: number) {
    return await Work.findOne({
      where: { id },
      include: [{ model: BalanceChange }, { model: Gambler }],
    });
  },
  async findOneWithCondition(condition: FindOptions) {
    return await Work.findOne(condition);
  },
  async findAllWithCondition(condition: FindOptions) {
    return await Work.findAll(condition);
  },
};
