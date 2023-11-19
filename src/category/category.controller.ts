import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('카테고리')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @ApiOperation({
    summary: '카테고리 조회',
    description: '예산 설정, 지출에 사용할 카테고리를 조회합니다.',
  })
  @Get()
  async getCategoryList(): Promise<object[]> {
    return await this.categoryService.getCategoryList();
  }
}
