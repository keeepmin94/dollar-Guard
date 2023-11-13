import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { categoryEnum } from 'src/category/type/category.enum';

@Injectable()
export class ExpenditureValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body')
      throw new BadRequestException('query 파라미터로 입력해주세요');

    if (Object.keys(value).length === 0) {
      const message = '수정할 값을 입력해주세요.';
      throw new BadRequestException(message);
    }

    if (value.category) {
      value.category = categoryEnum[value.category];
    }

    return value;
  }
}

@Injectable()
export class ExpenditureListValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'query')
      throw new BadRequestException('query 파라미터로 입력해주세요');

    const { startDate, endDate } = value;

    // 1. 날짜형식으로 포맷 (비교 및 기간 구하기 위해)
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 2. 날짜 비교 (startdate가 더 크면 에러)
    if (start > end) {
      const message = `조회 시작일이 종료일 보다 큽니다.`;
      throw new BadRequestException(message);
    }

    value.startDate = start;
    value.endDate = end;

    if (value.category) {
      value.category = categoryEnum[value.category];
    }

    if (value.minimum) {
      if (isNaN(value.minimum))
        throw new BadRequestException('최솟값은 숫자이어야합니다.');
      value.minimum = Number(value.minimum);
    }
    if (value.maximum) {
      if (isNaN(value.maximum))
        throw new BadRequestException('최대값은 숫자이어야합니다.');
      value.maximum = Number(value.maximum);
    }

    return value;
  }
}
