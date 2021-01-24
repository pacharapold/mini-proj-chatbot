import { OtpRequestType } from '@common/enum/OtpRequestType.enum';
import { EC, Invalid } from '@common/error/Invalid.error';
import GamblerRepository from '@common/repository/Gambler.repository';
import {
  IOtpRequestNew,
  IOtpRequestVerify,
} from '@common/type/OtpRequest.interface';
import { OtpRequest } from '@common/type/OtpRequest.model';
import { randStr } from '@common/util/common';
import { SmsClient } from '@common/util/thsmsClient';
import config from '@config/config';
import moment from 'moment';
import { Op } from 'sequelize';

export default {
  async generateOtp(position: number) {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < position; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  },
  async newOtpRequest(data: IOtpRequestNew) {
    let { telNo }: IOtpRequestNew = data;
    // * Verify Part
    telNo = telNo
      .trim()
      .split('-')
      .join('')
      .split(' ')
      .join('');
    if (
      !telNo.startsWith('0') ||
      telNo.startsWith('02') ||
      !telNo.match(/^[\d]{10}$/)
    ) {
      throw Invalid.badRequest(EC.INVALID_TEL_NO);
    }
    // * Find Already Register
    const checkGm = await GamblerRepository.findByTelNo(telNo);
    if (checkGm) throw Invalid.badRequest(EC.TEL_NO_ALREADY_EXIST);

    // * Find exist 10 min
    const reqTime = moment(new Date());
    const exist = await OtpRequest.findAll({
      where: {
        telNo,
        type: OtpRequestType.REGISTER,
        executed: false,
        createdAt: {
          [Op.gte]: reqTime.subtract(10, 'second'),
        },
      },
    });
    if (exist.length > 0) {
      throw Invalid.badRequest(EC.OTP_REQUEST_HAVE_TO_WAIT_MORE);
    }

    // * Generate information
    const genRef = randStr(4).toUpperCase();
    const genOtp = await this.generateOtp(6);
    // * Create in db
    await OtpRequest.create({
      telNo,
      type: OtpRequestType.REGISTER,
      reference: genRef,
      otp: genOtp,
      expiredAt: moment().add(5, 'minute'),
    });

    return { result: { reference: genRef } };
  },
  async verifyRequest(data: IOtpRequestVerify) {
    const { telNo, reference, otp }: IOtpRequestVerify = data;
    const record = await OtpRequest.findOne({
      where: {
        telNo,
        reference,
        otp,
        executed: false,
      },
    });
    if (!record) throw Invalid.badRequest(EC.OTP_REQUEST_DOES_NOT_EXIST);
    if (moment(new Date()).isAfter(record.expiredAt)) {
      throw Invalid.badRequest(EC.OTP_REQUEST_WAS_EXPIRED);
    }
    record.executed = true;
    await record.save();
    return { result: { verify: true, telNo: record.telNo } };
  },
  async findForRegister(telNo: string) {
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
