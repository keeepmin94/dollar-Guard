import { Test, TestingModule } from '@nestjs/testing';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { BudgetDto } from './dto/budget.dto';
import { User } from 'src/user/entities/user.entity';

describe('BudgetController', () => {
  let controller: BudgetController;
  const mockUser = new User();

  const mockBudgetService = {
    createBudget: jest.fn(),
    getUsersAverageRatio: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetController],
      providers: [{ provide: BudgetService, useValue: mockBudgetService }],
    }).compile();

    controller = module.get<BudgetController>(BudgetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('BudgetController', () => {
    const budgetDTO: BudgetDto = {
      startDate: new Date('2023-11-17'),
      endDate: new Date('2023-11-23'),
      priceByCategory: {
        식비: 200000,
        취미: 100000,
        교통: 50000,
        기타: 40000,
      },
    };

    const avg = [
      {
        category_name: '식비',
        ratio: 34.48,
        amount: 344000,
      },
      {
        category_name: '주거',
        ratio: 21.94,
        amount: 219000,
      },
      {
        category_name: '취미',
        ratio: 19.44,
        amount: 194000,
      },
      {
        category_name: '그외',
        ratio: 24.13,
        amount: 241000,
      },
    ];

    const createBudgetSpy = jest
      .spyOn(mockBudgetService, 'createBudget')
      .mockResolvedValue(null);

    const getUsersAverageRatioSpy = jest
      .spyOn(mockBudgetService, 'getUsersAverageRatio')
      .mockResolvedValue(avg);

    it('createBudget', async () => {
      await controller.createBudget(budgetDTO, mockUser);

      expect(createBudgetSpy).toBeCalledTimes(1);
      expect(createBudgetSpy).toBeCalledWith(budgetDTO, mockUser);
    });

    it('getUsersAverageRatio', async () => {
      const total: number = 30000;
      const rst = await controller.getAutoPercentage(total);

      expect(rst).toEqual(avg);
      expect(getUsersAverageRatioSpy).toBeCalledTimes(1);
      expect(getUsersAverageRatioSpy).toBeCalledWith(total);
    });
  });
});
