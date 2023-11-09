import { Test, TestingModule } from '@nestjs/testing';
import { ConsultingController } from './consulting.controller';

describe('ConsultingController', () => {
  let controller: ConsultingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultingController],
    }).compile();

    controller = module.get<ConsultingController>(ConsultingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
