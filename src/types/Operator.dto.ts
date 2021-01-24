import { Role } from '@common/enum/Role.enum';
import { IOperatorNew } from '@common/type/Operator.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class OperatorNewDto implements IOperatorNew {
  @IsString()
  @IsNotEmpty()
  public username!: string;
  @IsString()
  @IsNotEmpty()
  public name!: string;
  @IsString()
  @IsNotEmpty()
  public password!: string;
  @IsString()
  @IsNotEmpty()
  public telNo!: string;
  @IsString()
  @IsNotEmpty()
  public role!: Role;
}
