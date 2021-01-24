import { IAdminLogin } from '@common/type/Admin.interface';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AdminLoginDto implements IAdminLogin {
  @IsString()
  @IsNotEmpty()
  public username!: string;
  @IsString()
  @IsNotEmpty()
  public password!: string;
  @IsOptional()
  @IsBoolean()
  public rememberMe!: boolean;
}
