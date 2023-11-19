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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('지출')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('expenditure')
export class ExpenditureController {
  constructor(private expenditureService: ExpenditureService) {}

  @ApiOperation({
    summary: '지출 생성',
    description: '유저의 지출 기록 생성.',
  })
  @ApiResponse({
    status: 201,
    description: '성공',
    type: ExpenditureCreateDto,
  })
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

  @ApiOperation({
    summary: '지출 수정',
    description: '유저의 지출 기록 수정.',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
  })
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

  @ApiOperation({
    summary: '지출 삭제',
    description: '유저의 지출 기록 삭제.',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @Delete('/:id')
  async deleteExpenditure(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<object> {
    return await this.expenditureService.deleteExpenditure(id, user);
  }

  @ApiOperation({
    summary: '지출 목록 불러오기',
    description: '유저의 지출 목록 불러오기.',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
  })
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

  @ApiOperation({
    summary: '지난달 대비 지출 소비율',
    description: '유저의 지난달 대비 지출 소비율과 총합 통계',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @Get('/month')
  async getPreMonthPercentage(@GetUser() user: User): Promise<object[]> {
    return await this.expenditureService.getPreMonthPercentage(user);
  }

  @ApiOperation({
    summary: '지난주 대비 지출 소비율',
    description: '유저의 지난주 대비 지출 소비율과 총합 통계',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @Get('/week')
  async getPreWeekPercentage(@GetUser() user: User): Promise<object> {
    return await this.expenditureService.getPreWeekPercentage(user);
  }

  @ApiOperation({
    summary: '다른 유저 대비 소비율',
    description: '유저의 다른 유저 대비 지출 소비율과 총합 통계',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @Get('/users')
  async getUsersExpenditureStatistics(@GetUser() user: User): Promise<object> {
    return await this.expenditureService.getUsersExpenditureStatistics(user);
  }

  @ApiOperation({
    summary: '특정 지출 조회',
    description: '유저의 특정 지출 조회',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @Get('/:id')
  async getExpenditureDetail(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Expenditure> {
    return await this.expenditureService.getExpenditureDetail(id, user);
  }
}
