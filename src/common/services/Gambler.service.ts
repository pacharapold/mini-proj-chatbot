import GamblerType from '@common/enum/GamblerType.enum';
import { SocialType } from '@common/enum/SocialType.enum';
import { TxType } from '@common/enum/TxType.enum';
import { WorkStatus } from '@common/enum/WorkStatus.enum';
import { EC, Invalid } from '@common/error/Invalid.error';
import GamblerRepository from '@common/repository/Gambler.repository';
import GamblerBankAccountRepository from '@common/repository/GamblerBankAccount.repository';
import BalanceChangeService from '@common/service/BalanceChange.service';
import GamblerBankAccountService from '@common/service/GamblerBankAccount.service';
import OtpRequestService from '@common/service/OtpRequest.service';
import ProviderAccountService from '@common/service/ProviderAccount.service';
import SiteConfigService from '@common/service/SiteConfig.service';
import { getBankByAbbr } from '@common/type/Bank.interface';
import { IGamblerCreate } from '@common/type/Gambler.interface';
import { Gambler } from '@common/type/Gambler.model';
import {
  createReadableId,
  nextLetter,
  validPassword,
} from '@common/util/common';
import BigNumber from 'bignumber.js';

export default {
  async createGambler({
    accountName,
    accountNo,
    bankCode,
    site,
    telNo,
    password,
    reference,
    social,
    telNoStatus,
    otpCheck,
  }: IGamblerCreate) {
    const siteConfig = await SiteConfigService.getSiteConfig(site);
    // * Check Gambler telNo
    const checkGambler = await GamblerRepository.findByTelNo(telNo);
    if (checkGambler) throw Invalid.badRequest(EC.TEL_NO_ALREADY_EXIST);
    // * Check landing page && office register
    if (otpCheck) {
      // * Find TelNo in Request OTP is already executed
      const otpRequest = await OtpRequestService.getVerifiedOtp(telNo);
      if (!otpRequest) throw Invalid.badRequest(EC.REGISTER_OUT_OF_TIME);
    }
    // * Check password validation
    const isValidPassword = validPassword(password);
    if (!isValidPassword) throw Invalid.badRequest(EC.INVALID_PASSWORD);
    // * Find Parent from reference
    let parent: Gambler | null = null;
    if (reference) {
      parent = await Gambler.findOne({ where: { refCode: reference } });
      if (!parent) throw Invalid.badRequest(EC.REFERENCE_DOES_NOT_EXIST);
    }
    // * Check bank account validation
    const focusBank = getBankByAbbr(bankCode);
    if (!focusBank) throw Invalid.badRequest(EC.BANK_DOES_NOT_EXIST);
    if (accountNo.length !== focusBank.length) {
      throw Invalid.badRequest(EC.ACCOUNT_NO_HAS_WRONG_LENGTH);
    }
    // * Check Bank Account Exist
    const gmBankAcct = await GamblerBankAccountRepository.findByBankAccount({
      accountNo,
      bankCode: focusBank.code,
    });
    if (gmBankAcct) throw Invalid.badRequest(EC.BANK_ACCOUNT_ALREADY_EXIST);
    // * Find Deposit Sequence
    const sequence = await GamblerBankAccountService.findDepositSequence({
      accountNo,
      bankCode: focusBank.code,
      isUpdate: false,
    });
    // * Generate Username
    const prefix = siteConfig.usernamePrefix;
    let subPrefix = `aa`;
    let isDuplicate = true;
    let generateUsername = ``;
    while (isDuplicate) {
      generateUsername = `${prefix}${subPrefix}${telNo.slice(-4)}`;
      const duplicateUsername = await Gambler.findOne({
        where: { site, username: generateUsername },
        order: [['id', 'DESC']],
      });
      if (!duplicateUsername) isDuplicate = false;
      subPrefix = nextLetter(subPrefix);
    }
    // * Generate Reference
    const genRef = createReadableId(generateUsername.length);
    // * Generate Hash
    let generateHash = '';
    generateUsername.split('').map(char => {
      generateHash += char.charCodeAt(0).toString();
    });
    // * Check Social
    let focusSocial = SocialType[social];
    if (!focusSocial) {
      focusSocial = SocialType.OTHER;
    }
    const CURRENCY_CODE = 'THB';
    // * Create Gambler
    const gm = await Gambler.create({
      site,
      telNo,
      telNoStatus,
      password,
      refCode: genRef,
      hash: generateHash,
      refGamblerId: parent ? parent.id : null,
      type: GamblerType.NORMAL,
      username: generateUsername,
      social: focusSocial,
    });
    // * Create Gambler Bank Account
    const bankAcct = await GamblerBankAccountService.createGamblerBankAccount(
      { bankCode, accountNo, accountName, sequence },
      gm.id,
    );
    // * Create Balance (init)
    const balance = await BalanceChangeService.createBalanceChange({
      GamblerId: gm.id,
      amountChange: new BigNumber(0),
      currencyCode: CURRENCY_CODE,
      detail: {},
      tstamp: new Date(),
      type: TxType.INIT,
      status: WorkStatus.SUCCESS,
    });

    return { gm, bankAcct, balance };
  },
};
