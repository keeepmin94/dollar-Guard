import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import {
  ExpenditureCreateDto,
  ExpenditureUpdateDto,
} from './dto/expenditure.dto';
import { ExpenditureService } from './expenditure.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { ExpenditureValidationPipe } from './pipe/custom-expenditure.pipe';

@UseGuards(AuthGuard())
@Controller('expenditure')
export class ExpenditureController {
  constructor(private expenditureService: ExpenditureService) {}

  @Post()
  async createExpenditure(
    @Body() expenditureCreateDto: ExpenditureCreateDto,
    @Req() req,
  ): Promise<object> {
    return this.expenditureService.createExpenditure(
      expenditureCreateDto,
      req.user.userId,
    );
  }

  @Patch('/:id')
  async updateExpenditure(
    @Param('id', ParseIntPipe) id: number,
    @Body(ExpenditureValidationPipe) expenditureUpdateDto: ExpenditureUpdateDto,
    @Req() req,
  ) {
    console.log(id);
    console.log(req.user);
  }
}
