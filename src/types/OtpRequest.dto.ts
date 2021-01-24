import { IsNotEmpty, IsString } from 'class-validator';
import {
  IOtpRequestNew,
  IOtpRequestVerify,
} from '@common/type/OtpRequest.interface';

export class OtpRequestNewDto implements IOtpRequestNew {
  @IsNotEmpty()
  @IsString()
  public telNo!: string;
}

export class OtpRequestVerifyDto implements IOtpRequestVerify {
  @IsNotEmpty()
  @IsString()
  public telNo!: string;
  @IsNotEmpty()
  @IsString()
  public reference!: string;
  @IsNotEmpty()
  @IsString()
  public otp!: string;
}
