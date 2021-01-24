import {
  INomineeBankAccountFind,
  INomineeBankAccountFindType,
} from '@common/type/NomineeBankAccount.interface';
import { NomineeBankAccount } from '@common/type/NomineeBankAccount.model';
import { Op } from 'sequelize';

export default {
  async findNomineeByBankAccount({
    accountNo,
    bankCode,
  }: INomineeBankAccountFind) {
    return await NomineeBankAccount.findOne({
      where: {
        bankCode,
        accountNo,
      },
    });
  },
  async findNomineeBankAccountById(id: number) {
    return await NomineeBankAccount.findByPk(id);
  },
  async findAllNomineeByBankAccount({
    accountNo,
    bankCode,
  }: INomineeBankAccountFind) {
    return await NomineeBankAccount.findAll({
      where: {
        bankCode,
        accountNo,
      },
    });
  },

  async findNomineeByBankAccountAndType({
    accountNo,
    bankCode,
    type,
  }: INomineeBankAccountFindType) {
    return await NomineeBankAccount.findOne({
      where: {
        bankCode,
        accountNo,
        type: { [Op.in]: type },
      },
    });
  },
  async findAllNomineeByBankAccountAndType({
    accountNo,
    bankCode,
    type,
  }: INomineeBankAccountFindType) {
    return await NomineeBankAccount.findAll({
      where: {
        bankCode,
        accountNo,
        type: { [Op.in]: type },
      },
    });
  },
};
