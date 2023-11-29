import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BudgetService } from 'src/budget/budget.service';
import { Budget } from 'src/budget/entities/budget.entity';
import { BudgetCategory } from 'src/budget/entities/budgetCategory.entity';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { BudgetDto } from 'src/budget/dto/budget.dto';
import { categoryEnum } from 'src/category/type/category.enum';

describe('AuthService', () => {
  let service: BudgetService;
  const user = new User();

  const mockBudgetRepository = {
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockBudgetCategoryRepository = {
    save: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockCategoryRepository = { createQueryBuilder: jest.fn() };

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
  const budgetRst = {
    total: 4000,
    startDate: '2023-11-17',
    endDate: '2023-11-23',
    user: user,
  };
  const budgetCategoryRst = {
    amount: 4000,
    category: { id: categoryEnum['식비'] },
    budgetRst,
  };
  const queryBuilderResult = [
    { category_name: '식비', ratio: '34.48' },
    { category_name: '주거', ratio: '21.94' },
    { category_name: '취미', ratio: '19.44' },
    { category_name: '문화', ratio: '9.40' },
    { category_name: '레져', ratio: '6.58' },
    { category_name: '기타', ratio: '5.75' },
    { category_name: '교통', ratio: '2.40' },
  ];
  const chooseFuncResult = [
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetService,
        { provide: getRepositoryToken(Budget), useValue: mockBudgetRepository },
        {
          provide: getRepositoryToken(BudgetCategory),
          useValue: mockBudgetCategoryRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<BudgetService>(BudgetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const budgetSaveSpy = jest
    .spyOn(mockBudgetRepository, 'save')
    .mockResolvedValue(budgetRst);

  const budgetCreateSpy = jest
    .spyOn(mockBudgetRepository, 'create')
    .mockResolvedValue(budgetRst);

  const budgetCategorySaveSpy = jest
    .spyOn(mockBudgetCategoryRepository, 'save')
    .mockResolvedValue(null);

  const budgetCategoryCreateSpy = jest
    .spyOn(mockBudgetCategoryRepository, 'create')
    .mockResolvedValue(budgetCategoryRst);

  it('createBudget', async () => {
    await service.createBudget(budgetDTO, user);

    expect(budgetSaveSpy).toBeCalledTimes(1);
    expect(budgetCreateSpy).toBeCalledTimes(1);
    expect(budgetCategorySaveSpy).toBeCalledTimes(1);
    expect(budgetCategoryCreateSpy).toBeCalledTimes(
      Object.keys(budgetDTO.priceByCategory).length,
    );
  });

  jest
    .spyOn(mockBudgetCategoryRepository, 'createQueryBuilder')
    .mockReturnValue({
      subQuery: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getQuery: jest.fn().mockResolvedValue(''),
    } as any);

  const createQueryBuilderSpy = jest
    .spyOn(mockCategoryRepository, 'createQueryBuilder')
    .mockReturnValue({
      select: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(queryBuilderResult),
    } as any);

  it('getBudgetCategory', async () => {
    const result = await service.getUsersAverageRatio(1000000);

    expect(createQueryBuilderSpy).toBeCalledTimes(1);
    expect(result).toEqual(chooseFuncResult);
  });
});
