// import { Budget } from 'src/budget/entities/budget.entity';
import { User } from 'src/user/entities/user.entity';
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
  memo: string;

  @Column()
  exceptYn: boolean;

  @ManyToOne(() => Category, (category) => category.budgetCategorys)
  category: Category;

  @ManyToOne(() => User, (user) => user.expenditures)
  user: User;
}
