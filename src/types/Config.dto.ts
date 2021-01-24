import { IsNotEmpty, IsString, IsNumber, IsObject } from 'class-validator';
import { ConfigTopic } from '@common/enum/ConfigTopic.enum';
import {
  IConfigUpdate,
  IConfigDetail,
  IDefaultConfigUpdate,
} from '@common/type/Config.interface';

export class ConfigUpdateDto implements IConfigUpdate {
  @IsString()
  @IsNotEmpty()
  public topic!: ConfigTopic;
  @IsObject()
  @IsNotEmpty()
  public detail!: IConfigDetail;
}

export class DefaultConfigUpdateDto implements IDefaultConfigUpdate {
  @IsString()
  @IsNotEmpty()
  public topic!: ConfigTopic;

  @IsNotEmpty()
  public value!: string | number;
}
