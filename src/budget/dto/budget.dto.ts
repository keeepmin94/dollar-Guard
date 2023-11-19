import {
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValueOptions } from 'src/category/type/category.enum';
import { IsRightDateFormat } from 'src/common/customValidate.decorator';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

// 카테고리 형식 유효성 검사
@ValidatorConstraint({ name: 'IsRightBudgetByCategory' })
export class IsRightBudgetByCategory implements ValidatorConstraintInterface {
  private errorMessage = '';

  private isOptionValid(key: any): boolean {
    const index = ValueOptions.indexOf(key);
    return index !== -1;
  }

  validate(value: object): boolean {
    for (const key in value) {
      if (!this.isOptionValid(key)) {
        this.errorMessage = '카테고리를 확인해주세요.';
        return false;
      }
      if (isNaN(value[key])) {
        this.errorMessage = '예산은 숫자만 입력해 주세요.';
        return false;
      }
      if (Number(value[key]) <= 0) {
        this.errorMessage = '예산은 0보다 작을 수 없습니다.';
        return false;
      }
    }

    return true;
  }

  defaultMessage() {
    return this.errorMessage;
  }
}

@ApiExtraModels()
export class BudgetDto {
  @ApiProperty({
    required: true,
    type: String,
    description: '예산 시작일(yyyy-MM-dd)',
    example: '2023-11-01',
  })
  @Validate(IsRightDateFormat)
  startDate: Date;
  @ApiProperty({
    required: true,
    type: String,
    description: '예산 종료일(yyyy-MM-dd)',
    example: '2023-11-30',
  })
  @Validate(IsRightDateFormat)
  endDate: Date;
  @ApiProperty({
    required: true,
    type: Object,
    description: '카테고리별 금액(식비, 주거, 문화, 교통, 취미, 레져, 기타)',
    example: `
    {
      식비: 50000,
      거주: 60000,
      문화: 10000
    }
    `,
  })
  @Validate(IsRightBudgetByCategory)
  priceByCategory: object;
}
