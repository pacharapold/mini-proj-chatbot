import { EC, Invalid } from '@common/error/Invalid.error';
import { INomineeBankAccountUpdateBalanceById } from '@common/type/NomineeBankAccount.interface';
import { NomineeBankAccount } from '@common/type/NomineeBankAccount.model';
import moment from 'moment';

export default {
  async updateLastBalanceById({
    id,
    lastBalance,
    lastBalanceUpdate,
  }: INomineeBankAccountUpdateBalanceById) {
    const nomineeBa = await NomineeBankAccount.findByPk(id);
    if (!nomineeBa) return;
    if (moment(nomineeBa.lastBalanceUpdate).isAfter(lastBalanceUpdate)) return;
    nomineeBa.lastBalance = lastBalance;
    nomineeBa.lastBalanceUpdate = lastBalanceUpdate;
    await nomineeBa.save();
    return nomineeBa;
  },
};
