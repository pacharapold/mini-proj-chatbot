import { OtpRequest } from '@common/type/OtpRequest.model';
import moment from 'moment';
import { Op } from 'sequelize';

export default {
  async getVerifiedOtp(telNo: string) {
    return await OtpRequest.findOne({
      where: {
        telNo,
        executed: true,
        updatedAt: {
          [Op.gte]: moment(new Date()).subtract(10, 'minute'),
          [Op.lte]: moment(new Date()),
        },
      },
    });
  },
};
