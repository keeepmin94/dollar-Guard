import {
  Body,
  Controller,
  Post,
  Query,
  Req,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { BudgetDto } from './dto/budget.dto';
import { BudgetService } from './budget.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BudgetValidationPipe } from './pipe/custom-budget.pipe';

@UseGuards(AuthGuard())
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  async createBudget(
    @Body(BudgetValidationPipe) budgetDto: BudgetDto,
    @Req() req,
  ) {
    this.budgetService.createBudget(budgetDto, req.user.userId);
  }

  @Get()
  async getAutoPercentage(
    @Query('total', ParseIntPipe) total: number,
  ): Promise<object[]> {
    return this.budgetService.getUsersAverageRatio(total);
  }
}
