import {
  IsString,
  MaxLength,
  Validate,
  IsInt,
  IsIn,
  Min,
  IsBoolean,
} from 'class-validator';
import { IsRightDateFormat } from 'src/common/customValidate.decorator';
import { ValueOptions } from 'src/category/type/category.enum';
import { Category } from 'src/category/entities/category.entity';

export class ExpenditureCreateDto {
  @IsInt()
  @Min(100)
  amountSpent: number;

  @Validate(IsRightDateFormat)
  spentDate: Date;

  @IsString()
  @MaxLength(80)
  memo?: string;

  @IsBoolean()
  exceptYn: boolean;

  @IsIn(ValueOptions)
  category: string;
}

export class ExpenditureUpdateDto {
  @IsInt()
  @Min(100)
  amountSpent?: number;

  @Validate(IsRightDateFormat)
  spentDate?: Date;

  @IsString()
  @MaxLength(80)
  memo?: string;

  @IsBoolean()
  exceptYn?: boolean;

  @IsIn(ValueOptions)
  category?: Category;
}
