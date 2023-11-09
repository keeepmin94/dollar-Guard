import { Test, TestingModule } from '@nestjs/testing';
import { ConsultingService } from './consulting.service';

describe('ConsultingService', () => {
  let service: ConsultingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsultingService],
    }).compile();

    service = module.get<ConsultingService>(ConsultingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
