import { IBalanceChangeCreate } from '@common/type/BalanceChange.interface';
import BalanceRepository from '@common/repository/Balance.repository';
import BalanceService from '@common/service/Balance.service';
import { BalanceChange } from '@common/type/BalanceChange.model';

export default {
  async createBalanceChange({
    GamblerId,
    amountChange,
    detail,
    type,
    tstamp,
    currencyCode,
    status,
  }: IBalanceChangeCreate) {
    const balance =
      (await BalanceRepository.findBalance(GamblerId, currencyCode)) ??
      (await BalanceService.initBalance(GamblerId));

    const amountBefore = balance.amount;

    const validAmountChange = amountChange.plus(amountBefore).isNegative()
      ? amountBefore.negated()
      : amountChange;

    const amountAfter = balance.amount.plus(validAmountChange);
    const balanceChange = await BalanceChange.create({
      GamblerId,
      type,
      amountBefore,
      amountAfter,
      tstamp,
      currencyCode,
      status,
      amount: validAmountChange,
      details: detail,
    });
    return { balanceChange };
  },
};
