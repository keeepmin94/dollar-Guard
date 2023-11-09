import { Test, TestingModule } from '@nestjs/testing';
import { ExpenditureController } from './expenditure.controller';

describe('ExpenditureController', () => {
  let controller: ExpenditureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenditureController],
    }).compile();

    controller = module.get<ExpenditureController>(ExpenditureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
