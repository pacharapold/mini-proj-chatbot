import { SocialType } from '@common/enum/SocialType.enum';
import {
  IGamblerChangePassword,
  IGamblerForgetPassword,
  IGamblerLogin,
  IGamblerRegister,
  IGamblerWithdraw,
} from '@common/type/Gambler.interface';
import BigNumber from 'bignumber.js';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GamblerRegisterDto implements IGamblerRegister {
  @IsNotEmpty()
  @IsString()
  public telNo!: string;
  @IsNotEmpty()
  @IsString()
  public password!: string;
  @IsNotEmpty()
  @IsString()
  public bankCode!: string;
  @IsNotEmpty()
  @IsString()
  public accountNo!: string;
  @IsNotEmpty()
  @IsString()
  public accountName!: string;
  @IsOptional()
  @IsString()
  public reference!: string;
  @IsString()
  @IsOptional()
  public social!: SocialType;
}

export class GamblerLoginDto implements IGamblerLogin {
  @IsNotEmpty()
  @IsString()
  public password!: string;
  @IsOptional()
  @IsBoolean()
  public remember!: boolean;

  @IsOptional()
  @IsBoolean()
  public impersonate!: boolean;

  @IsNotEmpty()
  @IsString()
  public username!: string;
}

export class GamblerForgetPasswordDto implements IGamblerForgetPassword {
  @IsNotEmpty()
  @IsString()
  public telNo!: string;
}

export class GamblerChangePasswordDto implements IGamblerChangePassword {
  @IsNotEmpty()
  @IsString()
  public oldPassword!: string;
  @IsNotEmpty()
  @IsString()
  public newPassword!: string;
}

export class GamblerWithdrawDto implements IGamblerWithdraw {
  @IsNumber()
  @IsNotEmpty()
  public amount!: BigNumber;
}
