import { EC, Invalid } from '@common/error/Invalid.error';
import BalanceRepository from '@common/repository/Balance.repository';
import { Balance } from '@common/type/Balance.model';
import BigNumber from 'bignumber.js';

export default {
  async initBalance(GamblerId: number) {
    return await Balance.create({
      GamblerId,
      currencyCode: 'THB',
      amount: new BigNumber(0),
      lastBalanceUpdate: new Date(),
    });
  },

  async needUpdateProfileUi(GamblerId: number, currencyCode: string) {
    const balance = await BalanceRepository.findBalance(
      GamblerId,
      currencyCode,
    );
    if (!balance) {
      throw Invalid.internalError(EC.BALANCE_DOES_NOT_EXIST);
    }
    balance.needUpdateUi = true;
    await balance.save();
    return balance;
  },
};
