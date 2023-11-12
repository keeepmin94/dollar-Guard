import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as dayjs from 'dayjs';

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
