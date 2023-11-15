import { Injectable } from '@nestjs/common';
import { BaseEntity, EntityManager } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Budget } from 'src/budget/entities/budget.entity';
import { BudgetCategory } from 'src/budget/entities/budgetCategory.entity';
import { Category } from 'src/category/entities/category.entity';
import { Expenditure } from 'src/expenditure/entities/expenditure.entity';

@Injectable()
export class WebhookRepository extends BaseEntity {
  constructor(private manager: EntityManager) {
    super();
  }

  async getMorningConsultingUsers(consulting_yn: string): Promise<object[]> {
    const users = await this.manager.connection
      .createQueryBuilder()
      .select([
        'user.id',
        'user.discord_url',
        'budget.start_date',
        'budget.end_date',
        'budget.total',
        'budget.budget_id',
      ])
      .from(User, 'user')
      .where(`user.${consulting_yn} = true`)
      .andWhere('user.discord_url is not null')
      .innerJoin(
        (subBudget) => {
          return subBudget
            .select([
              'start_date',
              'end_date',
              'total',
              'id as budget_id',
              'user_id',
            ])
            .from(Budget, 'budget')
            .where('current_date between start_date and end_date');
        },
        'budget',
        'user.id = budget.user_id',
      )
      .getRawMany();

    return users;
  }

  async getUsersBudget(budget_id: number): Promise<object[]> {
    const budgets = await this.manager.connection
      .createQueryBuilder()
      .select([
        'sum(BudgetCategory.amount) AS total_price',
        'category.name AS category',
      ])
      .from(Budget, 'budget')
      .where('budget.id = :budget_id', { budget_id })
      .innerJoin(
        BudgetCategory,
        'BudgetCategory',
        'budget.id = BudgetCategory.budget_id',
      )
      .innerJoin(
        Category,
        'category',
        'BudgetCategory.category_id = category.id',
      )
      .groupBy('category.name')
      .getRawMany();

    return budgets;
  }

  async getUsersExpenditure(
    userId: string,
    start: Date,
    end: Date,
  ): Promise<object[]> {
    const expenditures = await this.manager.connection
      .createQueryBuilder()
      .select([
        'sum(expenditure.amount_spent) AS total_price',
        'category.name AS category',
      ])
      .from(Expenditure, 'expenditure')
      .where('expenditure.spent_date between :start and :end', { start, end })
      .andWhere('expenditure.user_id = :userId', { userId })
      .innerJoin(Category, 'category', 'expenditure.category_id = category.id')
      .groupBy('category.name')
      .getRawMany();

    return expenditures;
  }

  async getUsersTodayExpenditure(
    userId: string,
    today: Date,
  ): Promise<object[]> {
    const expenditures = await this.manager.connection
      .createQueryBuilder()
      .select([
        'sum(expenditure.amount_spent) AS total_price',
        'category.name AS category',
      ])
      .from(Expenditure, 'expenditure')
      .where('expenditure.spent_date = :today', { today })
      .andWhere('expenditure.user_id = :userId', { userId })
      .innerJoin(Category, 'category', 'expenditure.category_id = category.id')
      .groupBy('category.name')
      .getRawMany();

    return expenditures;
  }
}
