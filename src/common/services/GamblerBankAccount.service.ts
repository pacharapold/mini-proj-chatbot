import {
  IGamblerBankAccountCreate,
  IGamblerBankAccountUpdateDepositSequence,
} from '@common/type/GamblerBankAccount.interface';
import { GamblerBankAccount } from '@common/type/GamblerBankAccount.model';
import { Op } from 'sequelize';

export default {
  async findDepositSequence({
    accountNo,
    bankCode,
    isUpdate,
  }: IGamblerBankAccountUpdateDepositSequence) {
    const OFFSET = isUpdate ? 0 : 1;
    let hidden;
    switch (bankCode) {
      case 'KBANK':
        hidden = accountNo.slice(-7, -1);
        break;
      default:
        hidden = accountNo.slice(-6);
    }
    const count = await GamblerBankAccount.count({
      where: { bankCode, accountNo: { [Op.substring]: hidden } },
    });
    return count + OFFSET;
  },
  async createGamblerBankAccount(
    data: IGamblerBankAccountCreate,
    GamblerId: number,
  ) {
    const {
      accountName,
      accountNo,
      bankCode,
      sequence,
    }: IGamblerBankAccountCreate = data;
    return await GamblerBankAccount.create({
      bankCode,
      accountNo,
      accountName,
      GamblerId,
      sequence,
    });
  },
};
