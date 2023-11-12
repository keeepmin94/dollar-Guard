import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ExpenditureCreateDto,
  ExpenditureUpdateDto,
} from './dto/expenditure.dto';
import { ExpenditureService } from './expenditure.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { ExpenditureValidationPipe } from './pipe/custom-expenditure.pipe';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/user/entities/user.entity';

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
}
