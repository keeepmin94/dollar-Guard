import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getCategoryList(): Promise<object[]> {
    try {
      const categoryList = await this.categoryRepository.find();

      return categoryList;
    } catch (error) {
      throw new InternalServerErrorException(
        '카테고리 목록을 불러오는데 실패했습니다.',
      );
    }
  }
}
