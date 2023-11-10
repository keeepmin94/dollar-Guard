import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Budget } from './entities/budget.entity';
import { BudgetCategory } from './entities/budgetCategory.entity';
import { BudgetDto } from './dto/budget.dto';
import { categoryEnum } from 'src/category/type/category.enum';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    @InjectRepository(BudgetCategory)
    private budgetCategoryRepository: Repository<BudgetCategory>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 예산 총 합 구하기
  getTotalAmount(arr: number[]): number {
    let total: number = 0;
    arr.forEach((price) => {
      total += price;
    });
    return total;
  }

  //   getLastDate(paramDate: string): Date[] {
  //     const dateSplit = paramDate.split('-');
  //     const year = Number(dateSplit[0]);
  //     const month = Number(dateSplit[1]);

  //     const start = new Date(year, month, 1);
  //     const end = new Date(year, month + 1, 0);

  //     return [start, end];
  //   }

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
}
