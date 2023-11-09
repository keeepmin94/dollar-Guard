import { BudgetCategory } from 'src/budget/entities/budgetCategory.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('categorys')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => BudgetCategory, (budgetCategory) => budgetCategory.category)
  budgetCategorys: BudgetCategory[];

  // 지출 테이블
}
