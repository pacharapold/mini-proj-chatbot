import { OtpRequestType } from '@common/enum/OtpRequestType.enum';

export interface IOtpRequest {
  id: number;
  type: OtpRequestType;
  telNo: string;
  reference: string;
  otp: string;
  expiredAt: Date;
  executed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOtpRequestNew {
  telNo: string;
}

export interface IOtpRequestVerify {
  telNo: string;
  reference: string;
  otp: string;
}
