import { EC, Invalid } from '@common/error/Invalid.error';
import { INomineeCreate } from '@common/type/Nominee.interface';
import { Nominee } from '@common/type/Nominee.model';

export default {
  async createNominee({ fullName, telNo, alias }: INomineeCreate) {
    // case #1: find duplicate
    const nominee = await Nominee.findOne({ where: { alias } });
    if (nominee) {
      throw Invalid.badRequest(EC.NOMINEE_ALREADY_EXIST);
    }
    return await Nominee.create({
      fullName,
      telNo,
      alias,
    });
  },
};
