import { ChannelType } from '@common/enum/ChannelType.enum';
import {
  IPuppeteerChannelCreate,
  IPuppeteerChannelSearch,
  IPuppeteerChannelUpdate,
} from '@common/type/PuppeteerChannel.interface';
import { Pagination } from '@common/util/Page';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class PuppeteerChannelCreateDto implements IPuppeteerChannelCreate {
  @IsString()
  @IsNotEmpty()
  public ipAddress!: string;

  @IsString()
  @IsNotEmpty()
  public owner!: string;

  @IsString()
  @IsNotEmpty()
  public subOwner!: string;

  @IsString()
  @IsNotEmpty()
  public type!: ChannelType;
}

export class PuppeteerChannelUpdateDto implements IPuppeteerChannelUpdate {
  @IsNumber()
  @IsNotEmpty()
  public puppeteerChannelId!: number;

  @IsBoolean()
  @IsNotEmpty()
  public active!: boolean;
}

export class PuppeteerChannelSearchDto implements IPuppeteerChannelSearch {
  @IsObject()
  @IsNotEmpty()
  public pagination!: Pagination;

  @IsString()
  @IsOptional()
  public text!: string;

  @IsBoolean()
  @IsOptional()
  public active!: boolean;
}
