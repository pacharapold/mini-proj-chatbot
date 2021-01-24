import { TxType } from '@common/enum/TxType.enum';
import { BankMsg } from '@common/type/BankMsg.model';

export default {
  async findDepositBankMsgById(id: number) {
    return await BankMsg.findOne({
      where: {
        id,
        type: TxType.DEPOSIT,
      },
    });
  },
  async findById(id: number) {
    return await BankMsg.findByPk(id);
  },
};
