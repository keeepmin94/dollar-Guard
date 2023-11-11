import {
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValueOptions } from 'src/category/type/category.enum';
import * as dayjs from 'dayjs';

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

// 날짜 형식 유효성 검사
@ValidatorConstraint({ name: 'IsRightDateFormat' })
export class IsRightDateFormat implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    const regex = /^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/;
    return (
      typeof value === 'string' && regex.test(value) && dayjs(value).isValid()
    );
  }

  defaultMessage() {
    return '날짜 형식은 yyyy-MM-dd 입니다.';
  }
}

export class BudgetDto {
  @Validate(IsRightDateFormat)
  startDate: Date;
  @Validate(IsRightDateFormat)
  endDate: Date;
  @Validate(IsRightBudgetByCategory)
  priceByCategory: object;
}
