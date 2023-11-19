import {
  Body,
  Controller,
  Post,
  Query,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { BudgetDto } from './dto/budget.dto';
import { BudgetService } from './budget.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BudgetValidationPipe } from './pipe/custom-budget.pipe';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('예산 설정')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @ApiOperation({
    summary: '예산 설정',
    description: '유저가 카테고리별 예산 금액을 설정합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '성공',
    type: BudgetDto,
  })
  @Post()
  async createBudget(
    @Body(BudgetValidationPipe) budgetDto: BudgetDto,
    @GetUser() user: User,
  ) {
    this.budgetService.createBudget(budgetDto, user);
  }

  @ApiOperation({
    summary: '예산 추천',
    description:
      '총 금액 입력시 자동으로 카테고리별 알맞은 예산을 계산해 줍니다.',
  })
  @ApiQuery({
    name: 'total',
    required: true,
    description: '예산 총금액',
    example: '500000',
  })
  @ApiResponse({
    status: 201,
    description: '성공',
    type: Object,
  })
  @Get()
  async getAutoPercentage(
    @Query('total', ParseIntPipe) total: number,
  ): Promise<object[]> {
    return this.budgetService.getUsersAverageRatio(total);
  }
}
