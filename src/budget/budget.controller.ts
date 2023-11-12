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

@UseGuards(AuthGuard())
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  async createBudget(
    @Body(BudgetValidationPipe) budgetDto: BudgetDto,
    @GetUser() user: User,
  ) {
    this.budgetService.createBudget(budgetDto, user);
  }

  @Get()
  async getAutoPercentage(
    @Query('total', ParseIntPipe) total: number,
  ): Promise<object[]> {
    return this.budgetService.getUsersAverageRatio(total);
  }
}
