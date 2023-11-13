import { Module } from '@nestjs/common';
import { ExpenditureController } from './expenditure.controller';
import { ExpenditureService } from './expenditure.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expenditure } from './entities/expenditure.entity';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Expenditure, User, Category]),
  ],
  controllers: [ExpenditureController],
  providers: [ExpenditureService],
})
export class ExpenditureModule {}
