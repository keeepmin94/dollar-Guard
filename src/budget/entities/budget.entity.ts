import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BudgetCategory } from './budgetCategory.entity';

@Entity('budgets')
export class Budget extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @ManyToOne(() => User, (user) => user.budgets)
  user: User;

  // 카테고리별 예산
  @OneToMany(() => BudgetCategory, (budgetCategory) => budgetCategory.budget)
  budgetCategorys: BudgetCategory;
  // 지출 테이블
}
