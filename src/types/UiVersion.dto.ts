import { IUIConfigUpdate } from '@common/type/Config.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class UiVersionUpdateDto implements IUIConfigUpdate {
  @IsString()
  @IsNotEmpty()
  public version!: string;

  @IsString()
  @IsNotEmpty()
  public site!: string;
}
