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
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class ExpenditureCreateDto {
  @ApiProperty({ required: true, type: Number, description: '지출 금액' })
  @IsInt()
  @Min(100)
  amountSpent: number;

  @ApiProperty({
    required: true,
    type: String,
    description: '지출 일자(yyyy-MM-dd)',
  })
  @Validate(IsRightDateFormat)
  spentDate: Date;

  @ApiProperty({ required: false, type: String, description: '지출 내용' })
  @IsString()
  @MaxLength(80)
  memo?: string;

  @ApiProperty({ required: true, type: Boolean, description: '합계 제외' })
  @IsBoolean()
  exceptYn: boolean;

  @ApiProperty({ required: true, type: String, description: '지출 카테고리' })
  @IsIn(ValueOptions)
  category: string;
}

@ApiExtraModels()
export class ExpenditureUpdateDto {
  @ApiProperty({ required: false, type: Number, description: '지출 금액' })
  @IsInt()
  @Min(100)
  amountSpent?: number;

  @ApiProperty({
    required: false,
    type: String,
    description: '지출 일자(yyyy-MM-dd)',
  })
  @Validate(IsRightDateFormat)
  spentDate?: Date;

  @ApiProperty({ required: false, type: String, description: '지출 내용' })
  @IsString()
  @MaxLength(80)
  memo?: string;

  @ApiProperty({ required: false, type: Boolean, description: '합계 제외' })
  @IsBoolean()
  exceptYn?: boolean;

  @ApiProperty({ required: false, type: String, description: '지출 카테고리' })
  @IsIn(ValueOptions)
  category?: Category;
}

@ApiExtraModels()
export class ExpenditureListDto {
  @ApiProperty({
    required: true,
    type: String,
    description: '조회 시작 일자(yyyy-MM-dd)',
  })
  @Validate(IsRightDateFormat)
  startDate: Date;

  @ApiProperty({
    required: true,
    type: String,
    description: '조회 종료 일자(yyyy-MM-dd)',
  })
  @Validate(IsRightDateFormat)
  endDate: Date;

  @ApiProperty({ required: false, type: String, description: '지출 카테고리' })
  @IsIn(ValueOptions)
  category?: Category;

  @ApiProperty({ required: false, type: Number, description: '최소 금액' })
  minimum?: number;

  @ApiProperty({ required: false, type: Number, description: '최대 금액' })
  maximum?: number;
}
