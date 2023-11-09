import { Category } from 'src/category/entities/category.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Budget } from './budget.entity';

@Entity('budgetCategorys')
export class BudgetCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  // 카테고리 id
  @ManyToOne(() => Category, (category) => category.budgetCategorys)
  category: Category;
  // 예산 id
  @ManyToOne(() => Budget, (budget) => budget.budgetCategorys)
  budget: Budget;
}
