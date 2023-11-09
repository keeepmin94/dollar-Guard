import { Test, TestingModule } from '@nestjs/testing';
import { ExpenditureService } from './expenditure.service';

describe('ExpenditureService', () => {
  let service: ExpenditureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpenditureService],
    }).compile();

    service = module.get<ExpenditureService>(ExpenditureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
