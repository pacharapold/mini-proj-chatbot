import { AccountType } from '@common/enum/AccountType.enum';
import { EC, Invalid } from '@common/error/Invalid.error';
import { Nominee } from '@common/type/Nominee.model';
import {
  INomineeBankAccountHiddenBankAccountSearch,
  INomineeBankAccountLogin,
  INomineeBankAccountRequestLogin,
} from '@common/type/NomineeBankAccount.interface';
import { NomineeBankAccount } from '@common/type/NomineeBankAccount.model';
import PuppeteerChannelService from '@service/PuppeteerChannel.service';
import { FindOptions, Op } from 'sequelize';

export default {
  async getActivateDepositBankAccountByBankCode(
    bankCode: string,
    sequence: number,
  ) {
    return await NomineeBankAccount.findOne({
      where: { bankCode, sequence, active: true, type: AccountType.DEPOSIT },
      include: [{ model: Nominee }],
    });
  },
  async findNomineeBankAcctByHiddenAccountNo(
    hiddenAccountNo: string,
    bankCode: string,
    sequence: number,
  ) {
    return await NomineeBankAccount.findOne({
      where: {
        bankCode,
        sequence,
        accountNo: { [Op.like]: hiddenAccountNo },
      },
    });
  },
  async findOneWithCondition(condition: any) {
    return await NomineeBankAccount.findOne({
      where: {
        ...condition,
      },
      include: [{ model: Nominee }],
    });
  },
  async getLogin(data: INomineeBankAccountRequestLogin) {
    const { ipAddress, type }: INomineeBankAccountRequestLogin = data;
    const channel = await PuppeteerChannelService.findActiveBankByIpAddress(
      ipAddress,
    );
    if (!channel) throw Invalid.badRequest(EC.PUPPETEER_CHANNEL_DOES_NOT_EXIST);
    const nomineeBankAcct = await NomineeBankAccount.findOne({
      where: {
        type,
        bankCode: channel.owner,
        accountNo: channel.subOwner,
      },
      include: [{ model: Nominee }],
    });
    if (!nomineeBankAcct) {
      throw Invalid.badRequest(EC.NOMINEE_BANK_ACCOUNT_DOES_NOT_EXIST);
    }
    const result: INomineeBankAccountLogin = {
      type: nomineeBankAcct.type,
      accountBank: nomineeBankAcct.bankCode,
      accountNo: nomineeBankAcct.accountNo,
      accountName: nomineeBankAcct.Nominee.fullName,
      credentialLogin: nomineeBankAcct.username,
      credentialPassword: nomineeBankAcct.password,
    };
    return result;
  },
  async getActiveWithdrawBankAccount(bankCode: string, amount: number) {
    return await NomineeBankAccount.findOne({
      where: {
        bankCode,
        active: true,
        auto: true,
        type: AccountType.WITHDRAW,
        lastBalance: { [Op.gte]: amount },
      },
    });
  },
  async findByHiddenAccountNoAndBankCode({
    bankCode,
    hiddenAccountNo,
    type,
  }: INomineeBankAccountHiddenBankAccountSearch) {
    const accountNo = hiddenAccountNo.replace(/X/g, '%').replace(/x/g, '%');
    return await NomineeBankAccount.findOne({
      where: {
        bankCode,
        accountNo: { [Op.like]: accountNo },
        type: { [Op.in]: type },
      },
    });
  },
  async findWithCondition(condition: FindOptions) {
    return await NomineeBankAccount.findAll({ ...condition });
  },
};
