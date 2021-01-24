import { IGamblerBankAccountUpdate } from '@common/type/GamblerBankAccount.interface';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class GamblerBankAccountUpdateDto implements IGamblerBankAccountUpdate {
  @IsNumber()
  @IsNotEmpty()
  public GamblerId!: number;
  @IsString()
  @IsNotEmpty()
  public bankCode!: string;
  @IsString()
  @IsNotEmpty()
  @Length(10, 12)
  public accountNo!: string;
  @IsString()
  @IsNotEmpty()
  public accountName!: string;
}
