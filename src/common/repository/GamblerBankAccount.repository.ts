import { GamblerBankAccount } from '@common/type/GamblerBankAccount.model';

export default {
  async findByGamblerId(GamblerId: number): Promise<GamblerBankAccount | null> {
    return await GamblerBankAccount.findOne({ where: { GamblerId } });
  },

  async findByBankAccount(key: {
    bankCode: string;
    accountNo: string;
  }): Promise<GamblerBankAccount | null> {
    return await GamblerBankAccount.findOne({
      where: key,
    });
  },

  async findById(id: number): Promise<GamblerBankAccount | null> {
    return await GamblerBankAccount.findByPk(id);
  },
};
