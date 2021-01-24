import { WorkStatus } from '@common/enum/WorkStatus.enum';
import { EC, Invalid } from '@common/error/Invalid.error';
import ProviderAccountRepository from '@common/repository/ProviderAccount.repository';
import { IBalanceUpdateAfterWork } from '@common/type/Balance.interface';
import { Balance } from '@common/type/Balance.model';
import { sleep } from '@common/util/common';
import { transactionGuard } from '@midas-soft/midas-common';
import BalanceChangeService from '@service/BalanceChange.service';
import GamblerService from '@service/Gambler.service';
import BigNumber from 'bignumber.js';

export default {
  async findByGmId(GamblerId: number, currencyCode: string) {
    return await Balance.findOne({ where: { GamblerId, currencyCode } });
  },
  async initBalance(GamblerId: number) {
    return await Balance.create({
      GamblerId,
      currencyCode: 'THB',
      amount: new BigNumber(0),
      lastBalanceUpdate: new Date(),
    });
  },
  async gmUpdateBalance(GamblerId: number, currencyCode: string) {
    // * Ignore if no providerAccount
    const proAcct = await ProviderAccountRepository.findByGamblerId(GamblerId);
    if (!proAcct) return await GamblerService.gmProfile(GamblerId);
    const gmBalance = await Balance.findOne({
      where: {
        GamblerId,
        currencyCode,
      },
    });
    if (!gmBalance) throw Invalid.badRequest(EC.BALANCE_DOES_NOT_EXIST);
    gmBalance.needUpdateBalance = true;
    // TODO: Create Work
    await gmBalance.save();
    return await GamblerService.gmProfile(gmBalance.GamblerId);
  },
  async updateSuccessDeposit(data: IBalanceUpdateAfterWork) {
    const {
      GamblerId,
      currencyCode,
      remainingAmount,
      BalanceChangeId,
    }: IBalanceUpdateAfterWork = data;
    // * Find Balance
    const balance = await this.findByGmId(GamblerId, currencyCode);
    if (!balance) throw Invalid.badRequest(EC.BALANCE_DOES_NOT_EXIST);
    // * Find BalanceChange Update Status
    await transactionGuard(async () => {
      // * Update Balance
      balance.amount = new BigNumber(remainingAmount);
      balance.needUpdateUi = true;
      balance.lastBalanceUpdate = new Date();
      await balance.save();
      // * Update BalanceChange Status
      await BalanceChangeService.updateBalanceChangeStatus(
        BalanceChangeId,
        WorkStatus.SUCCESS,
      );
    });
  },
  async updateProfileUi() {
    while (true) {
      const needUpdates = await Balance.findAll({
        where: {
          needUpdateUi: true,
        },
      });
      for (const gm of needUpdates) {
        const profile = await GamblerService.gmProfile(gm.GamblerId);
        gm.needUpdateUi = false;
        await gm.save();
        // app.websocket.sendToUser(gm.GamblerId, 'profile', profile);
      }
      await sleep(1000);
    }
  },
  async updateBalanceByGamblerId(
    GamblerId: number,
    amount: number | BigNumber,
  ) {
    const balance = await Balance.findOne({ where: { GamblerId } });
    if (!balance) {
      console.log(`*** balance service: ${EC[EC.BALANCE_DOES_NOT_EXIST]}`);
      return;
    }
    balance.amount = new BigNumber(amount);
    await balance.save();
    return balance;
  },
};
