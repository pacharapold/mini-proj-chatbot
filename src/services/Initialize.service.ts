import { AccountType } from '@common/enum/AccountType.enum';
import { ConfigTopic } from '@common/enum/ConfigTopic.enum';
import { Role } from '@common/enum/Role.enum';
import ConfigService from '@common/service/Config.service';
import { Admin } from '@common/type/Admin.model';
import { BANKS } from '@common/type/Bank.interface';
import { ISiteConfig } from '@common/type/Config.interface';
import { Config } from '@common/type/Config.model';
import { Nominee } from '@common/type/Nominee.model';
import { NomineeBankAccount } from '@common/type/NomineeBankAccount.model';
import { Operator } from '@common/type/Operator.model';
import {
  aesEncrypt,
  generateSalt,
  loadOrCreateModel,
  sha256Encrypt,
} from '@common/util/common';
import { momentTH } from '@common/util/momentTH';
import config from '@config/config';
import BigNumber from 'bignumber.js';

const internetBankingAccount = (
  username: string | null | undefined,
  password: string | null | undefined,
) => {
  const userStr = username ? username.trim() : null;
  const passwordStr = password ? password.trim() : null;
  if (!userStr || !passwordStr) {
    return { encryptedUser: null, encryptedPassword: null };
  }
  return {
    encryptedUser: aesEncrypt(username!, config.PRIVATE_KEY),
    encryptedPassword: aesEncrypt(password!, config.PRIVATE_KEY),
  };
};

export default {
  async initialConfig() {
    // init office ui version
    await loadOrCreateModel(
      Config,
      { topic: ConfigTopic.OFFICE_UI_VERSION },
      {
        topic: ConfigTopic.OFFICE_UI_VERSION,
        detail: { value: '0' },
      },
    );
  },

  async initialAdmin() {
    const admin = {
      username: 'admin',
      password: config.ADMIN_PASS,
      telNo: '0899999999',
      detail: { role: Role.ADMIN },
      salt: '',
    };

    admin.salt = generateSalt();
    admin.password = sha256Encrypt(admin.password, admin.salt, 10);

    await loadOrCreateModel(
      Admin,
      {
        username: admin.username,
      },
      admin,
    );
  },

  async initialOperator() {
    const operatorList = [
      {
        name: 'agent01',
        username: 'agent01',
        password: 'miss@Pass01',
        telNo: '0844720961',
        role: Role.SUPERVISOR,
        salt: '',
      },
      {
        name: 'agent02',
        username: 'agent02',
        password: 'miss@Pass02',
        telNo: '0844720961',
        role: Role.SUPERVISOR,
        salt: '',
      },
      {
        name: 'operator01',
        username: 'operator01',
        password: 'miss@Pass01',
        telNo: '0844720961',
        role: Role.OPERATOR,
        salt: '',
      },
      {
        name: 'operator02',
        username: 'operator02',
        password: 'miss@Pass02',
        telNo: '0844720961',
        role: Role.OPERATOR,
        salt: '',
      },
    ];
    for (const operator of operatorList) {
      operator.salt = generateSalt();
      operator.password = sha256Encrypt(operator.password, operator.salt, 10);
      operator.telNo = operator.telNo
        .trim()
        .split('-')
        .join('')
        .split(' ')
        .join('');

      await loadOrCreateModel(
        Operator,
        { username: operator.username },
        operator,
      );
    }
  },

  async initialSystemOperator() {
    const operatorList = [
      {
        name: 'system',
        username: 'system',
        password: config.ADMIN_PASS,
        telNo: '0811111111',
        role: Role.SUPERVISOR,
        salt: '',
      },
    ];
    for (const operator of operatorList) {
      operator.salt = generateSalt();
      operator.password = sha256Encrypt(operator.password, operator.salt, 10);
      operator.telNo = operator.telNo
        .trim()
        .split('-')
        .join('')
        .split(' ')
        .join('');

      await loadOrCreateModel(
        Operator,
        { username: operator.username },
        operator,
      );
    }
  },

  async initialNominee() {
    // initialize nominee and bank account
    const nominee = await loadOrCreateModel<Nominee>(
      Nominee,
      {
        alias: 'nut',
      },
      {
        fullName: 'ณัฐพล ทิวาพัฒน์',
        alias: 'nut',
        telNo: '0642754317',
      },
    );
    const bankAcctList = [
      {
        NomineeId: nominee.id,
        type: AccountType.DEPOSIT,
        accountNo: '4170528607',
        bankCode: BANKS.SCB.code,
        username: 'scaleray',
        password: 'Aa252627',
        smsTelNo: '0642754317',
        sequence: 1,
        auto: true,
        active: true,
      },
      {
        NomineeId: nominee.id,
        type: AccountType.DEPOSIT,
        accountNo: '0533545181',
        bankCode: BANKS.KBANK.code,
        username: 'a0642754317',
        password: 'Add252627',
        smsTelNo: '0642754317',
        sequence: 1,
        auto: true,
        active: true,
      },
    ];
    for (const bankAcct of bankAcctList) {
      const { encryptedUser, encryptedPassword } = internetBankingAccount(
        bankAcct.username,
        bankAcct.password,
      );
      if (encryptedUser) bankAcct.username = encryptedUser;
      if (encryptedPassword) bankAcct.password = encryptedPassword;

      await loadOrCreateModel(
        NomineeBankAccount,
        {
          type: bankAcct.type,
          accountNo: bankAcct.accountNo,
          bankCode: bankAcct.bankCode,
        },
        bankAcct,
      );
    }
  },
  async initialClient() {
    await ConfigService.loadOrCreate({
      topic: ConfigTopic.NEXT_TICKET_DETAIL,
      detail: { value: Date.now() },
    });

    const NextBettingReport = momentTH()
      .addDay(1)
      .toDate()
      .setHours(13, 0, 0);
    await ConfigService.loadOrCreate({
      topic: ConfigTopic.NEXT_BETTING_REPORT,
      detail: { value: NextBettingReport },
    });
  },

  async initialSite() {
    // initial site list data (jumbo789 as default)
    const sites = ['jumbo789'];
    await ConfigService.loadOrCreate({
      topic: ConfigTopic.SITE,
      detail: { value: sites },
    });

    // initial site config data (jumbo789 as default)
    const MAIN_SITE = 'jumbo789';
    const lineMessage = `ทางเข้าเว็ป`;
    const siteConfig: ISiteConfig = {
      minimumDepositAmount: new BigNumber(20),
      minimumWithdrawAmount: new BigNumber(100),
      maximumWithdrawCount: 3,
      maximumWithdrawAuto: new BigNumber(500),
      maximumWithdrawAmountPerTime: new BigNumber(100000),
      maximumWithdrawAmountPerDay: new BigNumber(1000000),
      withdrawTurnoverTime: 1,
      withdrawTurnoverAutoValidation: false,
      announcement: '',
      uiVersion: '0',
      lineRegisterMessage: lineMessage,
      usernamePrefix: 'jb789',
      siteUrl: 'https://jumbo789.com',
      apiUrl: 'https://api.jumbo789.com',
    };

    // initial main site
    await ConfigService.loadOrCreate({
      topic: ConfigTopic.MAIN_SITE,
      detail: { value: MAIN_SITE },
    });
    await ConfigService.loadOrCreate({
      topic: MAIN_SITE,
      detail: siteConfig,
    });
  },
};
