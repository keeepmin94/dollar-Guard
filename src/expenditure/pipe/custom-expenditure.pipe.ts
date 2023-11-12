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
