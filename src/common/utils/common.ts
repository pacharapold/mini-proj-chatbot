import { EC, HS, Invalid } from '@common/error/Invalid.error';
import { momentTH } from '@common/util/momentTH';
import { BigNumber } from 'bignumber.js';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import { BelongsToOptions } from 'sequelize';

export const dateFormat = 'YYYY-MM-DD';
export const timeFormat = 'HH:mm:ss';

export const removeComma = (s: string) => {
  return s.split(',').join('');
};

export function readMoney(_s: string): BigNumber {
  const s = removeComma(_s.trim()).trim();
  if (s === '-') return BN_Zero;
  if (s === 'N/A') return BN_Zero;
  return new BigNumber(s);
}

export const findMid = (s: string, a: string, b: string) => {
  const p1 = s.indexOf(a);
  if (p1 >= 0) {
    const p2 = s.indexOf(b, p1 + a.length);
    if (p2 >= 0) return s.substring(p1 + a.length, p2);
  }
  throw new Error(`Not found either ${a} or ${b}`);
};

export const randInt = (limit: number) => {
  return Math.floor(Math.random() * limit);
};

export const randStr = (len: number) => {
  const result = [];
  const list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < len; i += 1) {
    result.push(list.charAt(Math.floor(Math.random() * list.length)));
  }
  return result.join('');
};

export const randNoOnly = (len: number) => {
  const result = [];
  const list = '0123456789';
  for (let i = 0; i < len; i += 1) {
    result.push(list.charAt(Math.floor(Math.random() * list.length)));
  }
  return result.join('');
};

export const randStrChar = (len: number) => {
  const result = [];
  const list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < len; i += 1) {
    result.push(list.charAt(Math.floor(Math.random() * list.length)));
  }
  return result.join('');
};

export const createReadableId = (len: number) => {
  const result = [];
  const list = 'abcdefhknprstxyz23456789';
  for (let i = 0; i < len; i += 1) {
    result.push(list.charAt(Math.floor(Math.random() * list.length)));
  }
  return result.join('');
};

export const loadAsBigNumber = (rec: any, colName: string) => {
  const v = rec.getDataValue(colName);
  return v && !(v instanceof BigNumber) ? new BigNumber(v) : v;
};

export const BN_Zero = new BigNumber(0);

export const missingField = (fieldName: string): Invalid => {
  return new Invalid(EC.MISSING_FIELD, HS.BAD_REQUEST, { fieldName });
};

export const unknownField = (fieldName: string): Invalid => {
  return new Invalid(EC.UNKNOWN_FIELD, HS.BAD_REQUEST, { fieldName });
};

export const restrictedOnDelete = (
  allowNull: boolean = false,
): BelongsToOptions => {
  return {
    foreignKey: { allowNull },
    onDelete: 'RESTRICT',
  };
};

export const sortChar = (s: string): string => {
  return s
    .split('')
    .sort()
    .join('');
};

export const loadOrCreateModel = async <T>(
  model: any,
  keyCondition: any,
  createJson: any,
): Promise<T> => {
  return (
    (await model.findOne({ where: keyCondition })) ??
    (await model.create(createJson))
  );
};

export const padInt = (num: number, len: number) => {
  const s = `${num}`;
  return s.padStart(len, '0');
};

export const getZeroArray = (len: number): number[] => {
  const result = [];
  for (let i = 0; i < len; i += 1) result.push(0);
  return result;
};

export const aesEncrypt = (password: string, key: string) => {
  return CryptoJS.AES.encrypt(password, key).toString();
};

export const aesDecrypt = (encrypted: string, key: string) => {
  return CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);
};

const isUrlSafe = (char: string) => {
  return /[a-zA-Z0-9\-_~.]+/.test(char);
};

export const urlEncodeBytes = (buf: any) => {
  let encoded = '';
  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < buf.length; i += 1) {
    const charBuf = Buffer.from('00', 'hex');
    charBuf.writeUInt8(buf[i], 0);
    const char = charBuf.toString();
    if (isUrlSafe(char)) {
      encoded += char;
    } else {
      encoded += `%${charBuf.toString('hex').toUpperCase()}`;
    }
  }
  return encoded;
};

export const urlDecodeBytes = (encoded: any) => {
  let decoded = Buffer.from('');
  for (let i = 0; i < encoded.length; i++) {
    if (encoded[i] === '%') {
      const charBuf = Buffer.from(`${encoded[i + 1]}${encoded[i + 2]}`, 'hex');
      decoded = Buffer.concat([decoded, charBuf]);
      i += 2;
    } else {
      const charBuf = Buffer.from(encoded[i]);
      decoded = Buffer.concat([decoded, charBuf]);
    }
  }
  return decoded;
};

export const sleep = async (ms: number) => {
  if (ms <= 0) return;
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

export const isJSON = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const sha256Encrypt = (
  password: string,
  salt: string,
  iteration: number,
) => {
  let saltedPassword = salt + password;
  for (let i = 0; i < iteration - 1; i++) {
    saltedPassword = CryptoJS.SHA256(saltedPassword).toString(
      CryptoJS.enc.Base64,
    );
  }
  saltedPassword = CryptoJS.SHA256(saltedPassword).toString(
    CryptoJS.enc.Base64,
  );
  return saltedPassword;
};

export const generateSalt = () =>
  CryptoJS.lib.WordArray.random(128 / 8).toString();

export const removeAllSpace = (str: string) => {
  return str.replace(/\r?\n|\r|\s/g, '');
};

export const validateDate = (dt: any): void => {
  if (dt && !moment(dt, dateFormat).isValid()) {
    throw Invalid.badRequest(EC.WRONG_DATE_FORMAT);
  }
};

export const validateTime = (t: any): void => {
  if (t && !moment(t, timeFormat).isValid()) {
    throw Invalid.badRequest(EC.WRONG_TIME_FORMAT);
  }
};

export const oneWayPasswordFromStr = (
  str: string,
  alphabetLen: number,
  numberLen: number,
) => {
  let result = '';
  let s = CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
  s = s + CryptoJS.SHA256(s).toString(CryptoJS.enc.Hex);

  let z = 0;
  for (let i = 0; i < alphabetLen; i++) {
    while (true) {
      const c = s[z++];
      if ('abcdefhknprstxyz'.indexOf(c) >= 0) {
        result += c;
        break;
      }
    }
  }
  z = 0;
  for (let i = 0; i < numberLen; i++) {
    while (true) {
      const c = s[z++];
      if ('23456789'.indexOf(c) >= 0) {
        result += c;
        break;
      }
    }
  }
  return result;
};

export const nextLetter = (s: string) => {
  let carry = 1;
  let res = '';
  for (let i = s.length - 1; i >= 0; i--) {
    let char = s.toUpperCase().charCodeAt(i);
    char += carry;
    if (char > 90) {
      char = 65;
      carry = 1;
    } else {
      carry = 0;
    }
    res = String.fromCharCode(char) + res;
    if (!carry) {
      res = s.substring(0, i) + res;
      break;
    }
  }
  if (carry) {
    res = 'A'.concat(res);
  }
  return res.toLowerCase();
};

export const sensitiveInfo = (
  data: string,
  showInfoCount: number,
  hiddenChar: string,
) => {
  return `${hiddenChar.repeat(data.length - showInfoCount)}${data.slice(
    -showInfoCount,
  )}`;
};

export const validPassword = (password: string) => {
  return /^[A-Za-z0-9@$!%*#?&]{6,}$/.test(password);
};
