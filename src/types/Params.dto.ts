import { IsNumberString, IsNotEmpty } from 'class-validator';

export class DefaultParamsDto {
  @IsNumberString({ no_symbols: true })
  @IsNotEmpty()
  public id!: string;
}
