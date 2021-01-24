import { IsString, IsNotEmpty, IsNumber, isNotEmpty } from 'class-validator';
import { ISmsReceive } from '@common/type/Sms.interface';

export class SmsReceiveDto implements ISmsReceive {
  @IsString()
  @IsNotEmpty()
  public smsDevice!: string;
  @IsString()
  @IsNotEmpty()
  public sender!: string;
  @IsString()
  @IsNotEmpty()
  public message!: string;
  @IsString()
  @IsNotEmpty()
  public uuid!: string;
  @IsNumber()
  @IsNotEmpty()
  public timestamp!: number;
}

export class SmsParamDto {
  @IsString()
  @IsNotEmpty()
  public ref!: string;
}
