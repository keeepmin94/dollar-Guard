import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Budget } from './entities/budget.entity';
import { BudgetCategory } from './entities/budgetCategory.entity';
import { BudgetDto } from './dto/budget.dto';
import { categoryEnum } from 'src/category/type/category.enum';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class BudgetService {
  private minimumRatio = 10;
  constructor(
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    @InjectRepository(BudgetCategory)
    private budgetCategoryRepository: Repository<BudgetCategory>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  // 예산 총 합 구하기
  getTotalAmount(arr: number[]): number {
    let total: number = 0;
    arr.forEach((price) => {
      total += price;
    });
    return total;
  }

  private makeEachBudgetByCategory(
    category: object,
    budget: Budget,
  ): BudgetCategory[] {
    const result: BudgetCategory[] = [];
    for (const key in category) {
      result.push(
        this.budgetCategoryRepository.create({
          amount: category[key],
          category: { id: categoryEnum[key] },
          budget,
        }),
      );
    }

    return result;
  }

  async createBudget(budgetDto: BudgetDto, userId: string) {
    const { startDate, endDate, priceByCategory } = budgetDto;

    const total: number = this.getTotalAmount(Object.values(priceByCategory));

    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      const budget_ = this.budgetRepository.create({
        total,
        startDate,
        endDate,
        user,
      });

      const budget = await this.budgetRepository.save(budget_);

      const eachBudget: BudgetCategory[] = this.makeEachBudgetByCategory(
        priceByCategory,
        budget,
      );

      await this.budgetCategoryRepository.save(eachBudget);
    } catch (error) {
      console.log(error);
    }
  }

  // 총액 비례 비율에 맞는 금액 계산
  getPercentageTotalAmount(ratio: object[], totalPrice: number): object[] {
    ratio = ratio.map((obj) => ({
      ...obj,
      ratio: Number(obj['ratio']),
    }));
    const percentages = ratio.filter(
      (percentageCategory) => percentageCategory['ratio'] >= this.minimumRatio,
    );
    const etc = ratio
      .filter(
        (percentageCategory) => percentageCategory['ratio'] < this.minimumRatio,
      )
      .reduce((sum, current) => {
        return sum + current['ratio'];
      }, 0);

    percentages.push({ category_name: '그외', ratio: etc });

    const percentageAmount = percentages.map((percentageCategory) => ({
      ...percentageCategory,
      amount:
        Math.floor((totalPrice * (percentageCategory['ratio'] / 100)) / 1000) *
        1000,
    }));

    return percentageAmount;
  }

  async getUsersAverageRatio(totalPrice: number): Promise<object[]> {
    try {
      const subQuery = this.budgetCategoryRepository
        .createQueryBuilder()
        .subQuery()
        .select([
          'category_id',
          'SUM(amount) as total_amount',
          '(select sum(total) from budgets) as total',
        ])
        .from(BudgetCategory, 'budgetCategory')
        .groupBy('category_id')
        .getQuery();

      const result = this.categoryRepository
        .createQueryBuilder('category')
        .select([
          'category.name',
          'ROUND(sub.total_amount * 100.0:: decimal/sub.total:: decimal, 2) as ratio',
        ])
        .innerJoin(subQuery, 'sub', 'sub.category_id = category.id')
        .orderBy('ratio', 'DESC');

      const ratio = await result.getRawMany();

      return this.getPercentageTotalAmount(ratio, totalPrice);
    } catch (error) {}
  }
}
