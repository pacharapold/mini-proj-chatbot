import { AccountType } from '@common/enum/AccountType.enum';
import { TxType } from '@common/enum/TxType.enum';
import { EC, Invalid } from '@common/error/Invalid.error';
import { BANKS, getBankByAbbr } from '@common/type/Bank.interface';
import { ISms, ISmsReceive } from '@common/type/Sms.interface';
import { Sms } from '@common/type/Sms.model';
import { removeComma, sleep } from '@common/util/common';
import { database } from '@config/database';
import BankMsgService from '@service/BankMsg.service';
import NomineeBankAccountService from '@service/NomineeBankAccount.service';
import NomineeBankAccountServiceCommon from '@common/service/NomineeBankAccount.service';
import SmsDeviceService from '@service/SmsDevice.service';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { Op } from 'sequelize';

import { transactionGuard } from '@midas-soft/midas-common';

const kbankMsgDepositPattern: RegExp[] = [
  /^((?<day>\d{2})\/(?<month>\d{2})\/(?<year>\d{2})\s(?<hh>\d{2}):(?<mm>\d{2})\sบช(?<destAcct>\S{8})\sรับโอนจาก(?<srcAcct>\S{8})\s(?<amount>\S+)บ)\sคงเหลือ\s(?<remainingAmt>\S+)บ/,
  /^((?<day>\d{2})\/(?<month>\d{2})\/(?<year>\d{2})\s(?<hh>\d{2}):(?<mm>\d{2})\sบช(?<destAcct>\S{8})\sรับโอนจาก(?<srcAcct>\S{8})\s(?<amount>\S+)บ)\sคงเหลือ(?<remainingAmt>\S+)บ/,
  /^((?<day>\d{2})\/(?<month>\d{2})\/(?<year>\d{2})\s(?<hh>\d{2}):(?<mm>\d{2})\sบช(?<destAcct>\S{8})\sรับโอนจาก(?<srcAcct>\S{8})\s(?<amount>\S+)บ)/,
];

const kbankMsgWithdrawPattern: RegExp[] = [
  /^((?<day>\d{2})\/(?<month>\d{2})\/(?<year>\d{2})\s(?<hh>\d{2}):(?<mm>\d{2})\sบช(?<srcAcct>\S{8})\sเงินออก(?<amount>\S+))\sคงเหลือ(?<remainingAmt>\S+)บ/,
  /^((?<day>\d{2})\/(?<month>\d{2})\/(?<year>\d{2})\s(?<hh>\d{2}):(?<mm>\d{2})\sหักบช(?<srcAcct>\S{8})\sเข้า(?<destAcct>\S{8})\s(?<amount>\S+))\sคงเหลือ(?<remainingAmt>\S+)บ/,
  /^((?<day>\d{2})\/(?<month>\d{2})\/(?<year>\d{2})\s(?<hh>\d{2}):(?<mm>\d{2})\sหักบช(?<srcAcct>\S{8})\sเข้า(?<destAcct>\S{8})\s(?<amount>\S+))บ/,
  /^((?<day>\d{2})\/(?<month>\d{2})\/(?<year>\d{2})\s(?<hh>\d{2}):(?<mm>\d{2})\sบช\s(?<srcAcct>\S{8})\sคงเหลือ\s(?<remainingAmt>\S+))บ/,
];

const kbankMsgDepositAbNormalPattern: RegExp[] = [
  /^((?<day>\d{2})\/(?<month>\d{2})\/(?<year>\d{2})\s(?<hh>\d{2}):(?<mm>\d{2})\sบช(?<destAcct>\S{8})\sเงินเข้า(?<amount>\S+))\sคงเหลือ\s(?<remainingAmt>\S+)บ/,
  /^((?<day>\d{2})\/(?<month>\d{2})\/(?<year>\d{2})\s(?<hh>\d{2}):(?<mm>\d{2})\sบช(?<destAcct>\S{8})\sเงินเข้า(?<amount>\S+))\sคงเหลือ(?<remainingAmt>\S+)บ/,
];

const scbMsgDepositPattern: RegExp[] = [
  /^((?<day>\d{2})\/(?<month>\d{2})@(?<hh>\d{2}):(?<mm>\d{2})\s(?<amount>\S+)\sจาก(?<srcBank>\S+)\/(?<srcAcct>\S+)เข้า(?<destAcct>\S+)\sใช้ได้(?<remainingAmt>\S+)บ)/,
  /^((?<day>\d{2})\/(?<month>\d{2})@(?<hh>\d{2}):(?<mm>\d{2})\s(?<amount>\S+)\sจาก(?<srcBank>\S+)\/(?<srcAcct>\S+)เข้า(?<destAcct>\S+))/,
  /^((?<day>\d{2})\/(?<month>\d{2})@(?<hh>\d{2}):(?<mm>\d{2})\s(?<amount>\S+)\sโอนจาก(?<srcAcct>.+)เข้า(?<destAcct>\S+)\sใช้ได้(?<remainingAmt>\S+)บ)/,
  /^((?<day>\d{2})\/(?<month>\d{2})@(?<hh>\d{2}):(?<mm>\d{2})\s(?<amount>\S+)\sโอนจาก(?<srcAcct>.+)เข้า(?<destAcct>\S+))/,
  /^((?<day>\d{2})\/(?<month>\d{2})@(?<hh>\d{2}):(?<mm>\d{2})\s(?<amount>\S+)\sเข้า(?<destAcct>\S{7}))/,
];

const scbMsgWithdrawPattern: RegExp[] = [
  /^((?<day>\d{2})\/(?<month>\d{2})\/(?<year>\d{2})\s(?<hh>\d{2}):(?<mm>\d{2})\sบช(?<srcAcct>\S{8})\sเงินออก(?<amount>\S+))\sคงเหลือ(?<remainingAmt>\S+)บ/,
  /^((?<day>\d{2})\/(?<month>\d{2})\/(?<year>\d{2})\s(?<hh>\d{2}):(?<mm>\d{2})\sหักบช(?<srcAcct>\S{8})\sเข้า(?<destAcct>\S{8})\s(?<amount>\S+))\sคงเหลือ(?<remainingAmt>\S+)บ/,
  /^((?<day>\d{2})\/(?<month>\d{2})\/(?<year>\d{2})\s(?<hh>\d{2}):(?<mm>\d{2})\sบช\s(?<srcAcct>\S{8})\sคงเหลือ\s(?<remainingAmt>\S+))บ/,
];

const scbUpdateDailyPattern: RegExp[] = [
  /^(ยอดเงินใช้ได้บ\/ช\s(?<destAcct>\S{7})\sวันที่\s(?<day>\d{2})\/(?<month>\d{2})\sเวลา\s(?<hh>\d{2}):(?<mm>\d{2})\sคือ\s(?<remainingAmt>\S+)\sบ)/,
  /^(ยอดเงินใช้ได้บ\/ช\s(?<destAcct>\S{7})\sวันที่\s(?<day>\d{2})\/(?<month>\d{2})\sเวลา\s(?<hh>\d{2}):(?<mm>\d{2})\sคือ\s(?<remainingAmt>\S+)บ)/,
];

const regexMatchAny = (patternList: RegExp[], msg: string) => {
  for (const pattern of patternList) {
    const matchResult = msg.match(pattern);
    if (matchResult != null) return matchResult;
  }
  return null;
};

export default {
  async collectSms(data: ISmsReceive) {
    const { timestamp, sender, message, smsDevice }: ISmsReceive = data;
    // * Verify SmsDevice
    const device = await SmsDeviceService.findByKey(smsDevice);
    if (!device) return null;
    // * Find Duplicate Sms in 24 hrs
    const duplicateMsg = await Sms.findAll({
      where: {
        SmsDeviceId: device.id,
        senderName: sender,
        msg: message,
        tstamp: {
          [Op.gte]: moment(timestamp).startOf('day'),
          [Op.lte]: moment(timestamp).endOf('day'),
        },
      },
    });
    if (duplicateMsg.length > 0) return null;
    // * Create Sms ( include ignore sender )
    return await Sms.create<Sms>({
      SmsDeviceId: device.id,
      senderName: sender,
      msg: message,
      tstamp: moment(timestamp),
    });
  },
  async pushMsg(data: ISmsReceive) {
    const { message, sender, uuid }: ISmsReceive = data;
    // const newSms: Sms | null = await app.queues.sms.process('NEW_SMS', data);
    return { uuid };
  },
  async getOtp(reference: string) {
    if (reference.length < 4) {
      throw Invalid.badRequest(EC.SMS_REFERENCE_WRONG_LENGTH);
    }

    const smsRecent: Sms[] = await Sms.findAll({
      limit: 100,
      order: [['id', 'DESC']],
    });

    if (smsRecent.length <= 0) {
      throw Invalid.badRequest(EC.SMS_NO_CURRENTLY_MESSAGE);
    }

    const findMsg = smsRecent.find(
      sms =>
        sms.msg.match(new RegExp(`Ref=${reference}`)) != null ||
        sms.msg.match(new RegExp(`Ref:${reference}`)) != null,
    );
    if (!findMsg) throw Invalid.badRequest(EC.SMS_DOES_NOT_EXIST);

    const focusMsg = findMsg.msg;
    const prefix = focusMsg.includes('OTP:') ? 'OTP:' : 'OTP=';
    const otp = focusMsg.substring(
      focusMsg.indexOf(prefix) + prefix.length,
      focusMsg.indexOf(prefix) + prefix.length + 6,
    );
    if (otp.length !== 6) throw Invalid.badRequest(EC.SMS_DOES_NOT_EXIST);
    return { otp, msg: focusMsg };
  },
  async executedSms() {
    // Mapping from raw sms to BankMsg for create tx
    const SENDER_NAME_KBANK = 'KBank';
    const SENDER_NAME_SCB = '027777777';
    while (true) {
      let matcherDeposit = null;
      let matcherWithdraw = null;
      let matcherAbNormalKbank = null;
      let matcherScbDaily = null;
      let sourceAccountNo: string | null = null;
      let sourceBankAbbr: string | null = null;
      let destinationAccountNo: string | null = null;
      let destinationBankAbbr: string | null = null;
      let amount: BigNumber | null = null;
      let remainingAmount: BigNumber | null = null;
      let txDateTime: Date;
      let year: number = moment(new Date()).get('year');
      // * Find not executed messages
      const messages = await Sms.findAll({ where: { executed: false } });
      if (messages.length <= 0) continue;
      for (const message of messages) {
        const { id, msg, senderName }: ISms = message;

        if (senderName === SENDER_NAME_KBANK) {
          sourceBankAbbr = BANKS.KBANK.code;
          destinationBankAbbr = BANKS.KBANK.code;
          matcherDeposit = regexMatchAny(kbankMsgDepositPattern, msg);
          matcherWithdraw = regexMatchAny(kbankMsgWithdrawPattern, msg);
          matcherAbNormalKbank = regexMatchAny(
            kbankMsgDepositAbNormalPattern,
            msg,
          );
        } else if (senderName === SENDER_NAME_SCB) {
          destinationBankAbbr = BANKS.SCB.code;
          matcherDeposit = regexMatchAny(scbMsgDepositPattern, msg);
          matcherWithdraw = regexMatchAny(scbMsgWithdrawPattern, msg);
          matcherScbDaily = regexMatchAny(scbUpdateDailyPattern, msg);
        }

        if (matcherDeposit && matcherDeposit.groups) {
          amount = new BigNumber(removeComma(matcherDeposit.groups.amount));
          destinationAccountNo = matcherDeposit.groups.destAcct;
          if (matcherDeposit.groups.year) {
            year = Number(`25${matcherDeposit.groups.year}`) - 543;
          }
          const dateUpdate = `${year}-${matcherDeposit.groups.month}-${matcherDeposit.groups.day} ${matcherDeposit.groups.hh}:${matcherDeposit.groups.mm}`;
          txDateTime = moment(dateUpdate, 'YYYY-MM-DD HH:mm').toDate();
          if (matcherDeposit.groups.srcAcct) {
            sourceAccountNo = matcherDeposit.groups.srcAcct;
          }
          if (matcherDeposit.groups.remainingAmt) {
            remainingAmount = new BigNumber(
              removeComma(matcherDeposit.groups.remainingAmt),
            );
          }
          if (senderName === SENDER_NAME_SCB) {
            sourceBankAbbr = BANKS.SCB.code;
            if (matcherDeposit.groups.srcBank) {
              const srcBankCode = getBankByAbbr(matcherDeposit.groups.srcBank);
              sourceBankAbbr = srcBankCode ? srcBankCode.code : null;
            }
          }
          // * Find NomineeBankAccount
          const nomineeBankAcct = await NomineeBankAccountService.findByHiddenAccountNoAndBankCode(
            {
              hiddenAccountNo: destinationAccountNo,
              bankCode: destinationBankAbbr!,
              type: [AccountType.DEPOSIT],
            },
          );
          // Save in BankMsg && flag execute raw sms (transaction)
          const newBankMsgDeposit = await transactionGuard(async () => {
            const bankMsg = await BankMsgService.createBankMsg({
              amount,
              remainingAmount,
              type: TxType.DEPOSIT,
              tstamp: txDateTime,
              toBankCode: destinationBankAbbr,
              toAccountNo: destinationAccountNo,
              fromBankCode: sourceBankAbbr,
              fromAccountNo: sourceAccountNo,
              SmsId: id,
              NomineeBankAccountId: nomineeBankAcct ? nomineeBankAcct.id : null,
            });
            message.readable = true;
            message.executed = true;
            await message.save();
          });
        } else if (matcherWithdraw && matcherWithdraw.groups) {
          sourceAccountNo = matcherWithdraw.groups.srcAcct;
          year = Number(`25${matcherWithdraw.groups.year}`) - 543;
          const dateUpdate = `${year}-${matcherWithdraw.groups.month}-${matcherWithdraw.groups.day} ${matcherWithdraw.groups.hh}:${matcherWithdraw.groups.mm}`;
          txDateTime = moment(dateUpdate, 'YYYY-MM-DD HH:mm').toDate();
          if (matcherWithdraw.groups.amount) {
            amount = new BigNumber(removeComma(matcherWithdraw.groups.amount));
          }
          if (matcherWithdraw.groups.destAcct) {
            destinationBankAbbr = null;
            destinationAccountNo = matcherWithdraw.groups.destAcct;
          }
          if (matcherWithdraw.groups.remainingAmt) {
            remainingAmount = new BigNumber(
              removeComma(matcherWithdraw.groups.remainingAmt),
            );
          }
          const nomineeBankAcct = await NomineeBankAccountService.findByHiddenAccountNoAndBankCode(
            {
              hiddenAccountNo: sourceAccountNo,
              bankCode: sourceBankAbbr!,
              type: [AccountType.WITHDRAW],
            },
          );
          // Save in BankMsg && flag execute raw sms (transaction)
          const newBankMsgWithdraw = await transactionGuard(async () => {
            const bankMsg = await BankMsgService.createBankMsg({
              amount,
              remainingAmount,
              type: TxType.WITHDRAW_BANK,
              tstamp: txDateTime,
              toBankCode: destinationBankAbbr,
              toAccountNo: destinationAccountNo,
              fromBankCode: sourceBankAbbr,
              fromAccountNo: sourceAccountNo,
              SmsId: id,
              NomineeBankAccountId: nomineeBankAcct ? nomineeBankAcct.id : null,
            });
            message.readable = true;
            message.executed = true;
            await message.save();
          });
        } else if (matcherAbNormalKbank && matcherAbNormalKbank.groups) {
          // ABNORMAL KBANK
          sourceBankAbbr = null;
          destinationAccountNo = matcherAbNormalKbank.groups.destAcct;
          amount = new BigNumber(
            removeComma(matcherAbNormalKbank.groups.amount),
          );
          if (matcherAbNormalKbank.groups.year) {
            year = Number(`25${matcherAbNormalKbank.groups.year}`) - 543;
          }
          const dateUpdate = `${year}-${matcherAbNormalKbank.groups.month}-${matcherAbNormalKbank.groups.day} ${matcherAbNormalKbank.groups.hh}:${matcherAbNormalKbank.groups.mm}`;
          txDateTime = moment(dateUpdate, 'YYYY-MM-DD HH:mm').toDate();
          if (matcherAbNormalKbank.groups.remainingAmt) {
            remainingAmount = new BigNumber(
              removeComma(matcherAbNormalKbank.groups.remainingAmt),
            );
          }
          // * Find NomineeBankAccount
          const nomineeBankAcct = await NomineeBankAccountService.findByHiddenAccountNoAndBankCode(
            {
              hiddenAccountNo: destinationAccountNo,
              bankCode: destinationBankAbbr!,
              type: [AccountType.DEPOSIT],
            },
          );
          // Save in BankMsg && flag execute raw sms (transaction)
          const newBankMsgDeposit = await transactionGuard(async () => {
            const bankMsg = await BankMsgService.createBankMsg({
              amount,
              remainingAmount,
              type: TxType.DEPOSIT,
              tstamp: txDateTime,
              toBankCode: destinationBankAbbr,
              toAccountNo: destinationAccountNo,
              fromBankCode: null,
              fromAccountNo: null,
              SmsId: id,
              NomineeBankAccountId: nomineeBankAcct ? nomineeBankAcct.id : null,
            });
            message.readable = true;
            message.executed = true;
            await message.save();
          });
        } else if (matcherScbDaily && matcherScbDaily.groups) {
          destinationAccountNo = matcherScbDaily.groups.destAcct;
          const dateUpdate = `${year}-${matcherScbDaily.groups.month}-${matcherScbDaily.groups.day} ${matcherScbDaily.groups.hh}:${matcherScbDaily.groups.mm}`;
          txDateTime = moment(dateUpdate, 'YYYY-MM-DD HH:mm').toDate();
          if (matcherScbDaily.groups.remainingAmt) {
            remainingAmount = new BigNumber(
              removeComma(matcherScbDaily.groups.remainingAmt),
            );
          }
          // * Find NomineeBankAccount
          const nomineeBankAcct = await NomineeBankAccountService.findByHiddenAccountNoAndBankCode(
            {
              hiddenAccountNo: destinationAccountNo,
              bankCode: destinationBankAbbr!,
              type: [AccountType.DEPOSIT],
            },
          );
          if (!nomineeBankAcct) {
            console.log(
              `*** sms: ${EC[EC.NOMINEE_BANK_ACCOUNT_DOES_NOT_EXIST]}`,
            );
            message.readable = true;
            message.executed = true;
            await message.save();
            continue;
          }
          // * Update NomineeBankAccount Balance
          await transactionGuard(async () => {
            await NomineeBankAccountServiceCommon.updateLastBalanceById({
              id: nomineeBankAcct.id,
              lastBalance: remainingAmount!,
              lastBalanceUpdate: txDateTime,
            });
            message.readable = true;
            message.executed = true;
            await message.save();
          });
        } else {
          message.executed = true;
          await message.save();
        }
      }
      // * Sleep Time
      await sleep(1000);
    }
  },
};
