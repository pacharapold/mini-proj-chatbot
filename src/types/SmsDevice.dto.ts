import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ISmsDeviceNew } from '@common/type/SmsDevice.interface';

export class SmsDeviceNewDto implements ISmsDeviceNew {
  @IsString()
  @IsNotEmpty()
  public key!: string;
  @IsString()
  @IsOptional()
  public remark!: string;
}
