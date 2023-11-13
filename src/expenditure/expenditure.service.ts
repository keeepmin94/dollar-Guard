import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expenditure } from './entities/expenditure.entity';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import {
  ExpenditureCreateDto,
  ExpenditureUpdateDto,
  ExpenditureListDto,
} from './dto/expenditure.dto';
import { categoryEnum } from 'src/category/type/category.enum';

@Injectable()
export class ExpenditureService {
  constructor(
    @InjectRepository(Expenditure)
    private expenditureRepository: Repository<Expenditure>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async createExpenditure(
    expenditureCreateDto: ExpenditureCreateDto,
    user: User,
  ): Promise<object> {
    try {
      const { amountSpent, spentDate, memo, exceptYn, category } =
        expenditureCreateDto;

      const expenditure_ = this.expenditureRepository.create({
        amountSpent,
        spentDate,
        memo: memo ? memo : '',
        exceptYn,
        category: { id: categoryEnum[category] },
        user,
      });

      await this.expenditureRepository.save(expenditure_);

      return { message: '지출을 성공적으로 저장했습니다.' };
    } catch (error) {}
  }

  async updateExpenditure(
    expenditureUpdateDto: ExpenditureUpdateDto,
    user: User,
    id: number,
  ): Promise<object> {
    try {
      const expenditure = await this.expenditureRepository.findOne({
        where: { id },
        relations: {
          user: true,
        },
      });

      if (!expenditure)
        throw new NotFoundException('해당 지출 내역을 찾을 수 없습니다.');

      if (expenditure.user.id !== user.id)
        throw new UnauthorizedException(
          '유저가 작성한 지출 내역만 수정할 수 있습니다.',
        );

      const updateValues = { ...expenditureUpdateDto };

      await this.expenditureRepository.update(id, updateValues);

      return { message: '성공적으로 지출 수정을 완료했습니다.' };
    } catch (error) {
      console.log(error);
    }
  }

  async deleteExpenditure(id: number, user: User): Promise<object> {
    try {
      const result = await this.expenditureRepository.delete({
        id,
        user: {
          id: user.id,
        },
      });

      if (result.affected === 0) {
        throw new NotFoundException(`Can't find Board with id ${id}`);
      }

      return { message: '성공적으로 지출 삭제를 완료했습니다.' };
    } catch (error) {
      console.log(error);
    }
  }

  async getExpenditureList(
    expenditureListDto: ExpenditureListDto,
    user: User,
  ): Promise<object[]> {
    try {
      const { startDate, endDate, category, minimum, maximum } =
        expenditureListDto;
      const userId = user.id;

      // 지출 합계
      const queryBuilderTotal = this.expenditureRepository
        .createQueryBuilder('expenditure')
        .select(['sum(amount_spent) as amount '])
        .where('user_id = :userId', { userId })
        .andWhere('spent_date >= :startDate', { startDate })
        .andWhere('spent_date <= :endDate', { endDate })
        .andWhere('except_yn = false ');

      if (category)
        queryBuilderTotal.andWhere('category_id = :category', { category });
      if (minimum)
        queryBuilderTotal.andWhere('spent_amount >= :minimum', { minimum });
      if (maximum)
        queryBuilderTotal.andWhere('spent_amount <= :maximum', { maximum });

      // ------------------------------------------------------------------

      // 카테고리별 지출 합계
      const subQuery = this.expenditureRepository
        .createQueryBuilder()
        .subQuery()
        .select(['sum(amount_spent) as amount', 'category_id '])
        .from(Expenditure, 'expenditure')
        .where('user_id = :userId', { userId })
        .andWhere('spent_date >= :startDate', { startDate })
        .andWhere('spent_date <= :endDate', { endDate })
        .andWhere('except_yn = false ');

      if (minimum) subQuery.andWhere('spent_amount >= :minimum', { minimum });

      if (maximum) subQuery.andWhere('spent_amount <= :maximum', { maximum });

      if (category) subQuery.andWhere('category_id = :category', { category });

      const finalQuery = subQuery.groupBy('category_id').getQuery();

      const queryBuilderCategory = this.categoryRepository
        .createQueryBuilder('cat')
        .select(['cat.name', 'sub.amount'])
        .innerJoin(finalQuery, 'sub', 'sub.category_id = cat.id')
        .setParameter('userId', userId)
        .setParameter('startDate', startDate)
        .setParameter('endDate', endDate);

      if (minimum) queryBuilderCategory.setParameter('minimum', minimum);

      if (maximum) queryBuilderCategory.setParameter('maximum', maximum);

      if (category) queryBuilderCategory.setParameter('category', category);

      //---------------------------------------------------------------------------

      // 지출 목록
      const listSubQuery = this.expenditureRepository
        .createQueryBuilder()
        .subQuery()
        .select([
          'id',
          'amount_spent',
          'spent_date',
          'except_yn',
          'category_id',
        ])
        .from(Expenditure, 'expenditure')
        .where('user_id = :userId', { userId })
        .andWhere('spent_date >= :startDate', { startDate })
        .andWhere('spent_date <= :endDate', { endDate });

      if (minimum)
        listSubQuery.andWhere('spent_amount >= :minimum', { minimum });

      if (maximum)
        listSubQuery.andWhere('spent_amount <= :maximum', { maximum });

      if (category)
        listSubQuery.andWhere('category_id = :category', { category });

      const finalListQuery = listSubQuery.getQuery();

      const queryBuilderList = this.categoryRepository
        .createQueryBuilder('cat')
        .select([
          'sub.id',
          'sub.amount_spent',
          'spent_date',
          'cat.name',
          'except_yn',
        ])
        .innerJoin(finalListQuery, 'sub', 'sub.category_id = cat.id')
        .setParameter('userId', userId)
        .setParameter('startDate', startDate)
        .setParameter('endDate', endDate);

      if (minimum) queryBuilderList.setParameter('minimum', minimum);

      if (maximum) queryBuilderList.setParameter('maximum', maximum);

      if (category) queryBuilderList.setParameter('category', category);

      const totalAmount = await queryBuilderTotal.getRawOne();
      const categoryAmount = await queryBuilderCategory.getRawMany();
      const list = await queryBuilderList.getRawMany();

      return [{ ...totalAmount }, { ...categoryAmount }, { ...list }];
    } catch (error) {
      console.log(error);
    }
  }

  async getExpenditureDetail(id: number, user: User): Promise<Expenditure> {
    try {
      const expenditure = await this.expenditureRepository.findOne({
        where: {
          id,
          user: {
            id: user.id,
          },
        },
        relations: {
          category: true,
        },
      });

      return expenditure;
    } catch (error) {
      console.log(error);
    }
  }
}
