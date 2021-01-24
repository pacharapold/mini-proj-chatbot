import { Promotion } from '@common/enum/Promotion.enum';
import {
  IsNotEmpty,
  IsNumber,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
class PromotionValidator implements ValidatorConstraintInterface {
  validate(text: string) {
    return (
      Promotion[text.toUpperCase() as Promotion] !== null &&
      Promotion[text.toUpperCase() as Promotion] !== undefined
    );
  }
}

export class AcceptCommissionDto {
  @IsNumber()
  @IsNotEmpty()
  public CommissionId!: number;
}
export class PromotionParamDto {
  @Validate(PromotionValidator, {
    message: `promotion must be in the promotion list`,
  })
  @IsNotEmpty()
  public promotion!: Promotion;
}
