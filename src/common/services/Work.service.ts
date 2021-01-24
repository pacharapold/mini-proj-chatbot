import { TxType } from '@common/enum/TxType.enum';
import { EC, Invalid } from '@common/error/Invalid.error';
import NomineeBankAccountRepository from '@common/repository/NomineeBankAccount.repository';
import { BalanceChange } from '@common/type/BalanceChange.model';
import { IDetailTxReportCreateWork } from '@common/type/DetailTxReport.interface';
import { Gambler } from '@common/type/Gambler.model';
import { IWorkCreateDeposit } from '@common/type/Work.interface';
import { Work } from '@common/type/Work.model';
import moment from 'moment';

export default {
  async createWorkImiwin({
    type,
    detail,
    GamblerId,
    BalanceChangeId,
    agentUserName,
    currencyCode,
  }: IWorkCreateDeposit) {
    return await Work.create({
      type,
      currencyCode,
      detail,
      BalanceChangeId,
      GamblerId,
      owner: 'IMIWIN',
      subOwner: agentUserName,
      createTstamp: new Date(),
      seq: new Date(),
    });
  },
  async findAllByBalanceChangeId(BalanceChangeId: number) {
    return await Work.findAll({
      where: { BalanceChangeId },
      include: [{ model: Gambler }, { model: BalanceChange }],
    });
  },
  async createReportWork({
    NomineeBankAccountId,
    statementDate,
  }: IDetailTxReportCreateWork) {
    const nomineeBankAccount = await NomineeBankAccountRepository.findNomineeBankAccountById(
      NomineeBankAccountId,
    );
    if (!nomineeBankAccount) {
      throw Invalid.badRequest(EC.NOMINEE_BANK_ACCOUNT_DOES_NOT_EXIST);
    }
    const currencyCode = 'THB';
    const txTstamp = moment(statementDate).subtract(1, 'day');
    const workBankReport = await Work.create({
      currencyCode,
      type: TxType.BANK_REPORT,
      owner: nomineeBankAccount.bankCode,
      subOwner: nomineeBankAccount.accountNo,
      createTstamp: new Date(),
      seq: new Date(),
      detail: {
        statementDate,
        type: nomineeBankAccount.type,
        fromTstamp: txTstamp.startOf('day'),
        toTstamp: txTstamp.endOf('day'),
        accountNo: nomineeBankAccount.accountNo,
        bankCode: nomineeBankAccount.bankCode,
        NomineeBankAccountId: nomineeBankAccount.id,
      },
    });
    return workBankReport;
  },
};
