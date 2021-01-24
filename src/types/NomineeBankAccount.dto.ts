import { AccountType } from '@common/enum/AccountType.enum';
import { INomineeBankAccountRequestLogin } from '@common/type/NomineeBankAccount.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class NomineeBankAccountLoginDto
  implements INomineeBankAccountRequestLogin {
  @IsString()
  @IsNotEmpty()
  public ipAddress!: string;
  @IsString()
  @IsNotEmpty()
  public type!: AccountType;
}
