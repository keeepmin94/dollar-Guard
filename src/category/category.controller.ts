import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';

@UseGuards(AuthGuard())
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  async getCategoryList(): Promise<object[]> {
    return await this.categoryService.getCategoryList();
  }
}
