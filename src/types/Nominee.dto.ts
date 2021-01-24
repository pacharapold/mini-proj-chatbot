import { INomineeCreate, INomineeSearch } from '@common/type/Nominee.interface';
import { Pagination } from '@common/util/Page';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class NomineeCreateDto implements INomineeCreate {
  @IsString()
  @IsNotEmpty()
  public fullName!: string;

  @IsString()
  @IsNotEmpty()
  public telNo!: string;

  @IsString()
  @IsNotEmpty()
  public alias!: string;
}

export class NomineeSearchDto implements INomineeSearch {
  @IsObject()
  @IsNotEmpty()
  public pagination!: Pagination;

  @IsString()
  @IsOptional()
  public text!: string;
}
