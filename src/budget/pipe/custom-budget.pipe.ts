import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class BudgetValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body')
      throw new BadRequestException('query 파라미터로 입력해주세요');

    const { startDate, endDate } = value;

    // 1. 날짜형식으로 포맷 (비교 및 기간 구하기 위해)
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 2. 날짜 비교 (startdate가 더 크면 에러)
    if (start > end) {
      const message = `예산 설정 시작일이 종료일 보다 큽니다.`;
      throw new BadRequestException(message);
    }

    value.startDate = start;
    value.endDate = end;

    return value;
  }
}
