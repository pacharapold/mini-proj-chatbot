import { AccountType } from '@common/enum/AccountType.enum';
import { EC, Invalid } from '@common/error/Invalid.error';
import GamblerBankAccountRepository from '@common/repository/GamblerBankAccount.repository';
import mapper from '@common/service/mapper.service';
import { BANKS, getBankByAbbr } from '@common/type/Bank.interface';
import { Gambler } from '@common/type/Gambler.model';
import {
  IGamblerBankAccountNameRetrieve,
  IGamblerBankAccountUpdate,
} from '@common/type/GamblerBankAccount.interface';
import { GamblerBankAccount } from '@common/type/GamblerBankAccount.model';
import NomineeBankAccountService from '@service/NomineeBankAccount.service';
import { Op } from 'sequelize';

export default {
  async findGmBankAccount(bankCode: string, accountNo: string) {
    return await GamblerBankAccount.findOne({ where: { bankCode, accountNo } });
  },
  async gamblerBankAccountUpdate(data: IGamblerBankAccountUpdate) {
    // Case 1 : Check bank Code
    const bankCode = getBankByAbbr(data.bankCode);
    if (!bankCode) throw Invalid.badRequest(EC.BANK_DOES_NOT_EXIST);

    // Case 2 : Check Gambler Id
    const gmBank = await GamblerBankAccount.findOne({
      where: {
        GamblerId: data.GamblerId,
      },
    });
    if (!gmBank) throw Invalid.badRequest(EC.GAMBLER_DOES_NOT_EXIST);

    // Case 3 : Check Gambler Bank Account
    const checkGamblerBankAccount = await GamblerBankAccountRepository.findByBankAccount(
      {
        bankCode: data.bankCode,
        accountNo: data.accountNo,
      },
    );

    if (checkGamblerBankAccount) {
      throw Invalid.badRequest(EC.BANK_ACCOUNT_ALREADY_EXIST);
    }

    // Update Gambler Bank Account
    gmBank.bankCode = data.bankCode;
    gmBank.accountName = data.accountName;
    gmBank.accountNo = data.accountNo;
    gmBank.active = false;
    await gmBank.save();

    return { result: gmBank };
  },
  async gmGetDepositBankAccount(GamblerId: number) {
    const gmBankAcct = await GamblerBankAccount.findOne({
      where: { GamblerId },
    });
    if (!gmBankAcct) {
      throw Invalid.badRequest(EC.GAMBLER_BANK_ACCOUNT_DOES_NOT_EXIST);
    }
    let focusBankCode;
    if (gmBankAcct.bankCode === BANKS.KBANK.code) {
      focusBankCode = BANKS.KBANK.code;
    } else {
      focusBankCode = BANKS.SCB.code;
    }
    // * Bank Part
    const nomineeBankAcct = await NomineeBankAccountService.getActivateDepositBankAccountByBankCode(
      focusBankCode,
      gmBankAcct.sequence,
    );
    if (!nomineeBankAcct) {
      throw Invalid.internalError(EC.NOMINEE_BANK_ACCOUNT_DOES_NOT_EXIST);
    }
    // * True Wallet Part
    let trueWallet = null;
    const trueWalletAcct = await NomineeBankAccountService.getActivateDepositBankAccountByBankCode(
      'TRUE_WALLET',
      gmBankAcct.sequence,
    );
    if (trueWalletAcct) {
      trueWallet = {
        accountName: trueWalletAcct.Nominee.fullName,
        accountNo: trueWalletAcct.accountNo,
        bankCode: trueWalletAcct.bankCode,
      };
    }
    return {
      trueWallet,
      result: {
        accountName: nomineeBankAcct!.Nominee.fullName,
        accountNo: nomineeBankAcct!.accountNo,
        bankCode: nomineeBankAcct!.bankCode,
      },
    };
  },
  async findByGmId(GamblerId: number) {
    return await GamblerBankAccount.findOne({ where: { GamblerId } });
  },
  async findGmBankAcctByHiddenAccountNo(
    hiddenAccountNo: string,
    bankCode: string,
  ) {
    return await GamblerBankAccount.findOne({
      where: {
        bankCode,
        accountNo: { [Op.like]: hiddenAccountNo },
      },
      include: [{ model: Gambler }],
    });
  },
};
