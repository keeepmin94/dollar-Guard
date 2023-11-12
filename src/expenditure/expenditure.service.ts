import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expenditure } from './entities/expenditure.entity';
import { User } from 'src/user/entities/user.entity';
import { ExpenditureCreateDto } from './dto/expenditure.dto';
import { categoryEnum } from 'src/category/type/category.enum';

@Injectable()
export class ExpenditureService {
  constructor(
    @InjectRepository(Expenditure)
    private expenditureRepository: Repository<Expenditure>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createExpenditure(
    expenditureCreateDto: ExpenditureCreateDto,
    userId: string,
  ): Promise<object> {
    try {
      const { amountSpent, spentDate, memo, exceptYn, category } =
        expenditureCreateDto;

      const user = await this.userRepository.findOne({ where: { id: userId } });

      const expenditure_ = this.expenditureRepository.create({
        amountSpent,
        spentDate,
        memo: memo ? memo : '',
        exceptYn,
        category: { id: categoryEnum[category] },
        user,
      });

      await this.expenditureRepository.save(expenditure_);

      return { message: '지출을 성공적으로 저장했습니다.' };
    } catch (error) {}
  }

  //   async updateExpenditure()
}
