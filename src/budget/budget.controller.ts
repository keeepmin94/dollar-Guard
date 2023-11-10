import { Body, Controller, Post, Req } from '@nestjs/common';
import { BudgetDto } from './dto/budget.dto';
import { BudgetService } from './budget.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BudgetValidationPipe } from './pipe/custom-budget.pipe';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @UseGuards(AuthGuard())
  @Post()
  async createBudget(
    @Body(BudgetValidationPipe) budgetDto: BudgetDto,
    @Req() req,
  ) {
    this.budgetService.createBudget(budgetDto, req.user.userId);
  }
}
