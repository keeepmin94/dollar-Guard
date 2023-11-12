import { Budget } from 'src/budget/entities/budget.entity';
import { Expenditure } from 'src/expenditure/entities/expenditure.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ length: 50, unique: true })
  userName: string;

  @Column()
  password: string;

  @Column({ nullable: false, type: 'boolean', default: false })
  morningConsultingYn: boolean;

  @Column({ nullable: false, type: 'boolean', default: false })
  eveningConsultingYn: boolean;

  @Column({ nullable: true, type: 'varchar', default: null })
  discordUrl: string;

  @OneToMany(() => Budget, (budget) => budget.user)
  budgets: Budget[];

  @OneToMany(() => Expenditure, (expenditure) => expenditure.user)
  expenditures: Expenditure[];
}
