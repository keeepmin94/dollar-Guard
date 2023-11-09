import { Budget } from 'src/budget/entities/budget.entity';
import { Category } from 'src/category/entities/category.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('expenditures')
export class Expenditure extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amountSpent: number;

  @Column()
  spentDate: Date;

  @Column()
  exceptYn: boolean;

  @ManyToOne(() => Category, (category) => category.budgetCategorys)
  category: Category;
  // 예산 id
  @ManyToOne(() => Budget, (budget) => budget.budgetCategorys)
  budget: Budget;

  // 지출 테이블
}
