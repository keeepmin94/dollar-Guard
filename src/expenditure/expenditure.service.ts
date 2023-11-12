import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expenditure } from './entities/expenditure.entity';
import { User } from 'src/user/entities/user.entity';
import {
  ExpenditureCreateDto,
  ExpenditureUpdateDto,
} from './dto/expenditure.dto';
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
    user: User,
  ): Promise<object> {
    try {
      const { amountSpent, spentDate, memo, exceptYn, category } =
        expenditureCreateDto;

      //const user = await this.userRepository.findOne({ where: { id: userId } });

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

  async updateExpenditure(
    expenditureUpdateDto: ExpenditureUpdateDto,
    user: User,
    id: number,
  ): Promise<object> {
    try {
      const expenditure = await this.expenditureRepository.findOne({
        where: { id },
        relations: {
          user: true,
        },
      });

      if (!expenditure)
        throw new NotFoundException('해당 지출 내역을 찾을 수 없습니다.');

      if (expenditure.user.id !== user.id)
        throw new UnauthorizedException(
          '유저가 작성한 지출 내역만 수정할 수 있습니다.',
        );

      const updateValues = { ...expenditureUpdateDto };

      await this.expenditureRepository.update(id, updateValues);

      return { message: '성공적으로 지출 수정을 완료했습니다.' };
    } catch (error) {
      console.log(error);
    }
  }

  async deleteExpenditure(id: number, user: User): Promise<object> {
    try {
      const result = await this.expenditureRepository.delete({
        id,
        user: {
          id: user.id,
        },
      });

      if (result.affected === 0) {
        throw new NotFoundException(`Can't find Board with id ${id}`);
      }

      return { message: '성공적으로 지출 삭제를 완료했습니다.' };
    } catch (error) {
      console.log(error);
    }
  }
}
