import { Role } from '@common/enum/Role.enum';
import TelNoStatus from '@common/enum/TelNoStatus.enum';
import { TxType } from '@common/enum/TxType.enum';
import { EC, Invalid } from '@common/error/Invalid.error';
import GamblerRepository from '@common/repository/Gambler.repository';
import GamblerBankAccountRepository from '@common/repository/GamblerBankAccount.repository';
import ProviderAccountRepository from '@common/repository/ProviderAccount.repository';
import TurnoverRepository from '@common/repository/Turnover.repository';
import GamblerService from '@common/service/Gambler.service';
import mapper from '@common/service/mapper.service';
import SiteConfigService from '@common/service/SiteConfig.service';
import {
  IGamblerChangePassword,
  IGamblerForgetPassword,
  IGamblerLogin,
  IGamblerProfile,
  IGamblerProfileUi,
  IGamblerRegister,
  IGamblerWithdraw,
} from '@common/type/Gambler.interface';
import { Gambler } from '@common/type/Gambler.model';
import { validPassword } from '@common/util/common';
import { createSign } from '@common/util/imiutils';
import { SmsClient } from '@common/util/thsmsClient';
import config from '@config/config';
import { transactionGuard } from '@midas-soft/midas-common';
import BalanceService from '@service/Balance.service';
import BalanceChangeService from '@service/BalanceChange.service';
import { IPayloadInfo, signJWT } from '@util/passport';
import BigNumber from 'bignumber.js';

import app from '..';

export default {
  async gmRegister(
    {
      telNo,
      password,
      reference,
      bankCode,
      accountNo,
      accountName,
      social,
    }: IGamblerRegister,
    site: string,
  ) {
    const result = await transactionGuard(async () => {
      return await GamblerService.createGambler({
        telNo,
        password,
        reference,
        bankCode,
        accountNo,
        accountName,
        social,
        site,
        telNoStatus: TelNoStatus.GOOD,
        otpCheck: true,
      });
    });
    // * Sign JWT
    const payloadInfo: IPayloadInfo = {
      role: Role.GAMBLER,
      id: result.gm.id,
      username: result.gm.username,
      rememberMe: true,
      impersonate: false,
    };
    const token = signJWT(payloadInfo, '30 days');
    return { token };
  },
  async gmLogin(data: IGamblerLogin, site: string) {
    const { password, username, remember, impersonate }: IGamblerLogin = data;
    // * Find Gambler from username
    const gm =
      (await GamblerRepository.findByUsernameAndSite({ site, username })) ??
      (await GamblerRepository.findByTelNoAndSite({ site, telNo: username }));
    if (!gm) throw Invalid.unAuthorized(EC.INCORRECT_TEL_NO_OR_PASSWORD);
    // * Password Verify
    if (gm.password.toLowerCase() !== password.toLowerCase()) {
      throw Invalid.unAuthorized(EC.INCORRECT_TEL_NO_OR_PASSWORD);
    }
    // * Sign JWT
    const payloadInfo: IPayloadInfo = {
      role: Role.GAMBLER,
      id: gm.id,
      username: gm.username,
      rememberMe: remember,
      impersonate:
        impersonate !== null && impersonate !== undefined && impersonate,
    };
    const token = signJWT(payloadInfo, remember ? '30 days' : '1 days');
    return { token };
  },
  async gmForgetPassword(data: IGamblerForgetPassword) {
    const { telNo }: IGamblerForgetPassword = data;
    const FREQUENCY = 30 * 1000;
    const gm = await GamblerRepository.findByTelNo(telNo);
    if (!gm) throw Invalid.badRequest(EC.GAMBLER_DOES_NOT_EXIST);
    if (gm.lastForgetPass) {
      const gap = Date.now() - new Date(gm.lastForgetPass).getTime();
      if (gap < FREQUENCY) {
        throw Invalid.badRequest(EC.FORGET_PASSWORD_HAVE_TO_WAIT_MORE);
      }
    }
    gm.lastForgetPass = new Date();
    await gm.save();
    return { result: true };
  },
  async gmChangePassword(id: number, data: IGamblerChangePassword) {
    const { newPassword, oldPassword }: IGamblerChangePassword = data;
    const gm = await Gambler.findByPk(id);
    if (!gm) throw Invalid.badRequest(EC.GAMBLER_DOES_NOT_EXIST);
    // * Check Change Time
    const GAP_CHANGE_PASS = 60 * 60 * 1000;
    if (gm.lastChangePass) {
      const diff = Date.now() - new Date(gm.lastChangePass).getTime();
      if (diff < GAP_CHANGE_PASS) {
        throw Invalid.badRequest(EC.CHANGE_PASSWORD_HAVE_TO_WAIT_MORE);
      }
    }
    // * Check Same Password
    if (gm.password.toLowerCase() === newPassword.toLowerCase()) {
      throw Invalid.badRequest(EC.CANNOT_REUSE_AN_OLD_PASSWORD);
    }
    // * Check Old Password
    if (oldPassword.toLowerCase() !== gm.password.toLowerCase()) {
      throw Invalid.badRequest(EC.INCORRECT_PASSWORD);
    }
    // * Validate New Password
    const isValidPassword = validPassword(newPassword);
    if (!isValidPassword) throw Invalid.badRequest(EC.INVALID_PASSWORD);
    // * Update Gambler
    gm.password = newPassword;
    gm.lastChangePass = new Date();
    await gm.save();
    return { result: true };
  },
  // TODO Wait for refactor
  async gmProfile(id: number) {
    // * Find Gambler
    const gm = await Gambler.findOne({
      where: { id },
      include: [{ model: Gambler, as: 'parent' }],
    });
    if (!gm) throw Invalid.badRequest(EC.GAMBLER_DOES_NOT_EXIST);
    // * Find Balance
    const ba = await BalanceService.findByGmId(gm.id, 'THB');
    if (!ba) throw Invalid.badRequest(EC.BALANCE_DOES_NOT_EXIST);
    // * Find BankAccount
    const gmBankAcct = await GamblerBankAccountRepository.findByGamblerId(
      gm.id,
    );
    if (!gmBankAcct) {
      throw Invalid.badRequest(EC.GAMBLER_BANK_ACCOUNT_DOES_NOT_EXIST);
    }
    // * Find Configs
    const {
      minimumDepositAmount,
      minimumWithdrawAmount,
      maximumWithdrawCount,
      maximumWithdrawAuto,
      maximumWithdrawAmountPerTime,
      maximumWithdrawAmountPerDay,
      withdrawTurnoverTime,
      withdrawTurnoverAutoValidation,
      announcement,
    } = await SiteConfigService.getSiteConfig(gm.site);
    // * Find Withdraw Count ( from balanceChange )
    const wCount = await BalanceChangeService.getWithdrawCountByGmId(gm.id);
    const baChanges = await BalanceChangeService.getBalanceChangeByGmId(gm.id, [
      TxType.DEPOSIT,
      TxType.WITHDRAW,
      TxType.PROMOTION,
    ]);
    const bcChangesMapping = baChanges.map(bc =>
      mapper.balanceChangeProfileUi(bc),
    );
    // * Manage Parent
    let parentData: IGamblerProfile | null = null;
    if (gm.refGamblerId) {
      parentData = {
        telNo: gm.parent.telNo,
        telNoStatus: gm.parent.telNoStatus,
        refCode: gm.parent.refCode,
        username: gm.parent.username,
        type: gm.parent.type,
        site: gm.site,
      };
    }
    // * Find ProviderAccount
    const providerAcct = await ProviderAccountRepository.findByGamblerId(gm.id);
    const gmTurnover = await TurnoverRepository.findTurnover(gm.id);
    const turnover = gmTurnover
      ? { played: gmTurnover.playedTurnover, target: gmTurnover.turnover }
      : null;
    const result: IGamblerProfileUi = {
      turnover,
      gambler: {
        id: gm.id,
        telNo: gm.telNo,
        refCode: gm.refCode,
        createdAt: gm.createdAt,
        lastChangePass: gm.lastChangePass,
        lastForgetPass: gm.lastForgetPass,
        telNoStatus: gm.telNoStatus,
        username: gm.username,
        type: gm.type,
        site: gm.site,
      },
      parent: parentData,
      balance: {
        amount: ba.amount,
        isUpdating: ba.needUpdateBalance,
        lastBalanceUpdate: ba.lastBalanceUpdate,
      },
      bankAccount: {
        id: gmBankAcct.id,
        accountName: gmBankAcct.accountName,
        accountNameRetrieved: gmBankAcct.accountNameRetrieved,
        accountNo: gmBankAcct.accountNo,
        active: gmBankAcct.active,
        bankCode: gmBankAcct.bankCode,
        lockWithdraw: gmBankAcct.lockWithdraw,
        verifyName: gmBankAcct.verifyName,
      },
      withdrawCount: wCount,
      configs: {
        maximumWithdrawCount,
        maximumWithdrawAuto,
        maximumWithdrawAmountPerTime,
        maximumWithdrawAmountPerDay,
        withdrawTurnoverAutoValidation,
        announcement,
        minimumDeposit: minimumDepositAmount,
        minimumWithdraw: minimumWithdrawAmount,
        withdrawTurnoverTimes: withdrawTurnoverTime,
      },
      balanceChanges: bcChangesMapping,
      promotions: [],
      hasAccount: providerAcct ? true : false,
    };
    return result;
  },
  // TODO Wait for refactor
  async gmRequestWithdraw(
    id: number,
    data: IGamblerWithdraw,
    currencyCode: string,
  ) {
    const { amount }: IGamblerWithdraw = data;
    const withdrawAmount = new BigNumber(amount.toFixed(2));
    // * Find Gambler
    const gm = await Gambler.findByPk(id);
    if (!gm) throw Invalid.badRequest(EC.GAMBLER_DOES_NOT_EXIST);
    // * Get Config
    const siteConfig = await SiteConfigService.getSiteConfig(gm.site);
    // * Check Amount ( config )
    if (withdrawAmount.isLessThan(siteConfig.minimumWithdrawAmount)) {
      throw Invalid.badRequest(EC.MINIMUM_WITHDRAW_AMOUNT);
    }
    // * Check Withdraw Time ( config )
    const wCount = await BalanceChangeService.getWithdrawCountByGmId(gm.id);
    if (wCount >= siteConfig.maximumWithdrawCount) {
      throw Invalid.badRequest(EC.MAXIMUM_WITHDRAW_COUNT);
    }
    // * Check Amount Per Time ( config )
    if (withdrawAmount.isGreaterThan(siteConfig.maximumWithdrawAmountPerTime)) {
      throw Invalid.badRequest(EC.MAXIMUM_WITHDRAW_AMOUNT_PER_TIME);
    }
    // * Check Amount Per Day ( config )
    const withdraws = await BalanceChangeService.getWithdrawByGmId(gm.id);
    const withdrawPerDay = withdraws.map(tx => new BigNumber(tx.amount).abs());
    if (withdrawPerDay.length > 0) {
      const sumPerDay = withdrawPerDay
        .reduce((a, b) => a.plus(b))
        .plus(withdrawAmount);
      if (sumPerDay.isGreaterThan(siteConfig.maximumWithdrawAmountPerDay)) {
        throw Invalid.badRequest(EC.MAXIMUM_WITHDRAW_AMOUNT_PER_DAY);
      }
    }
    // * Find GamblerBankAccount
    const gmBankAcct = await GamblerBankAccountRepository.findByGamblerId(
      gm.id,
    );
    if (!gmBankAcct) {
      throw Invalid.badRequest(EC.GAMBLER_BANK_ACCOUNT_DOES_NOT_EXIST);
    }
    // * Check Turn Over Auto Validate
    if (
      siteConfig.withdrawTurnoverAutoValidation &&
      gmBankAcct.validateTurnover
    ) {
      const turnover = await TurnoverRepository.findTurnover(gm.id);
      if (!turnover) {
        throw Invalid.badRequest(EC.PROVIDER_ACCOUNT_DOES_NOT_EXIST);
      }
      const minPlayedTurnOver = turnover.turnover.multipliedBy(
        siteConfig.withdrawTurnoverTime,
      );
      if (turnover.playedTurnover.isLessThan(minPlayedTurnOver)) {
        throw Invalid.badRequest(EC.TURN_OVER_NOT_UP_TO_TARGET);
      }
    }
    // * Find Balance
    const ba = await BalanceService.findByGmId(gm.id, currencyCode);
    if (!ba) throw Invalid.badRequest(EC.BALANCE_DOES_NOT_EXIST);
    // * Check Balance && Withdraw Amount
    if (withdrawAmount.isGreaterThan(ba.amount)) {
      throw Invalid.badRequest(EC.NOT_ENOUGH_BALANCE);
    }
    // * Valid GamblerBankAccount
    if (!gmBankAcct.active) {
      throw Invalid.badRequest(EC.GAMBLER_BANK_ACCOUNT_INACTIVE);
    }
    if (gmBankAcct.lockWithdraw) {
      throw Invalid.badRequest(EC.GAMBLER_BANK_ACCOUNT_LOCK_WITHDRAW);
    }
    if (!gmBankAcct.verifyName) {
      throw Invalid.badRequest(
        EC.GAMBLER_BANK_ACCOUNT_VERIFY_NAME_DOES_NOT_EXIST,
      );
    }
    if (!gmBankAcct.accountNameRetrieved) {
      throw Invalid.badRequest(EC.GAMBLER_BANK_ACCOUNT_NOT_VERIFY_YET);
    }
    // * Find Provider Account
    const gmProAcct = await ProviderAccountRepository.findByGamblerId(gm.id);
    if (!gmProAcct) {
      throw Invalid.badRequest(EC.PROVIDER_ACCOUNT_DOES_NOT_EXIST);
    }
    // * Check Latest Work
    const lastWorkWithdraw = await BalanceChangeService.getInCompleteBalanceChange(
      gm.id,
      TxType.WITHDRAW,
    );
    if (lastWorkWithdraw) {
      throw Invalid.badRequest(EC.STILL_INCOMPLETE_WORK_WITHDRAW);
    }
    // * Pass through
    const withdraw = await BalanceChangeService.withdraw({
      currencyCode,
      GamblerId: gm.id,
      amount: withdrawAmount,
    });
    // * Response Gambler Profile
    const profile = await this.gmProfile(gmBankAcct.GamblerId);
    return profile;
  },
};
