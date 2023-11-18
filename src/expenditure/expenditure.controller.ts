import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ExpenditureCreateDto,
  ExpenditureUpdateDto,
  ExpenditureListDto,
} from './dto/expenditure.dto';
import { ExpenditureService } from './expenditure.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import {
  ExpenditureValidationPipe,
  ExpenditureListValidationPipe,
} from './pipe/custom-expenditure.pipe';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Expenditure } from './entities/expenditure.entity';

@UseGuards(AuthGuard())
@Controller('expenditure')
export class ExpenditureController {
  constructor(private expenditureService: ExpenditureService) {}

  @Post()
  async createExpenditure(
    @Body() expenditureCreateDto: ExpenditureCreateDto,
    @GetUser() user: User,
  ): Promise<object> {
    return await this.expenditureService.createExpenditure(
      expenditureCreateDto,
      user,
    );
  }

  @Patch('/:id')
  async updateExpenditure(
    @Param('id', ParseIntPipe) id: number,
    @Body(ExpenditureValidationPipe) expenditureUpdateDto: ExpenditureUpdateDto,
    @GetUser() user: User,
  ): Promise<object> {
    return await this.expenditureService.updateExpenditure(
      expenditureUpdateDto,
      user,
      id,
    );
  }

  @Delete('/:id')
  async deleteExpenditure(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<object> {
    return await this.expenditureService.deleteExpenditure(id, user);
  }

  @Get('list')
  async getExpenditureList(
    @Query(ExpenditureListValidationPipe)
    expenditureListDto: ExpenditureListDto,
    @GetUser() user: User,
  ): Promise<object[]> {
    return await this.expenditureService.getExpenditureList(
      expenditureListDto,
      user,
    );
  }

  @Get('/month')
  async getPreMonthPercentage(@GetUser() user: User): Promise<object[]> {
    return await this.expenditureService.getPreMonthPercentage(user);
  }

  @Get('/week')
  async getPreWeekPercentage(@GetUser() user: User): Promise<object> {
    return await this.expenditureService.getPreWeekPercentage(user);
  }

  @Get('/:id')
  async getExpenditureDetail(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Expenditure> {
    return await this.expenditureService.getExpenditureDetail(id, user);
  }
}
