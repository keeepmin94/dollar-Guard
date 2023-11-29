import { Test, TestingModule } from '@nestjs/testing';
import { ExpenditureService } from 'src/expenditure/expenditure.service';
import { Expenditure } from 'src/expenditure/entities/expenditure.entity';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { DataSource } from 'typeorm';
import {
  ExpenditureCreateDto,
  ExpenditureUpdateDto,
} from 'src/expenditure/dto/expenditure.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { categoryEnum } from 'src/category/type/category.enum';
import { NotFoundException } from '@nestjs/common';

describe('ExpenditureService', () => {
  let service: ExpenditureService;
  const user = new User();

  const mockExpenditureRepository = {
    save: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCategoryRepository = { createQueryBuilder: jest.fn() };

  const mockDataSourceRepository = { createQueryBuilder: jest.fn() };

  const expenditureCreateDto: ExpenditureCreateDto = {
    amountSpent: 40000,
    spentDate: new Date('2023-11-18'),
    exceptYn: false,
    category: '식비',
  };

  const expenditureUpdateDto: ExpenditureUpdateDto = {
    memo: '메모수정',
    amountSpent: 50000,
  };

  const expenditureResult = {
    ...expenditureCreateDto,
    user,
    memo: expenditureCreateDto.memo ? expenditureCreateDto.memo : '',
    category: { id: categoryEnum[expenditureCreateDto.category] },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenditureService,
        {
          provide: getRepositoryToken(Expenditure),
          useValue: mockExpenditureRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSourceRepository,
        },
      ],
    }).compile();

    service = module.get<ExpenditureService>(ExpenditureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const expenditureCreateSpy = jest
    .spyOn(mockExpenditureRepository, 'create')
    .mockResolvedValue(expenditureResult);

  const expenditureSaveSpy = jest
    .spyOn(mockExpenditureRepository, 'save')
    .mockResolvedValue(null);

  it('Expenditure Create', async () => {
    const result = await service.createExpenditure(expenditureCreateDto, user);

    expect(result).toEqual({ message: '지출을 성공적으로 저장했습니다.' });
    expect(expenditureCreateSpy).toBeCalledTimes(1);
    expect(expenditureCreateSpy).toBeCalledWith(expenditureResult);
    expect(expenditureSaveSpy).toBeCalledTimes(1);
    //expect(expenditureSaveSpy).toBeCalledWith(expenditureCreateSpy);
  });

  it('Expenditure Update', async () => {
    const expenditureFindOneSpy = jest
      .spyOn(mockExpenditureRepository, 'findOne')
      .mockResolvedValue(expenditureResult);

    const result = await service.updateExpenditure(
      expenditureUpdateDto,
      user,
      1,
    );

    expect(result).toEqual({
      message: '성공적으로 지출 수정을 완료했습니다.',
    });
    expect(expenditureFindOneSpy).toBeCalledTimes(1);
  });

  it('Expenditure Update Error', async () => {
    jest
      .spyOn(mockExpenditureRepository, 'findOne')
      .mockResolvedValue(undefined);
    try {
      await service.updateExpenditure(expenditureUpdateDto, user, 1);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it('Expenditure delete', async () => {
    const expenditureDeleteSpy = jest
      .spyOn(mockExpenditureRepository, 'delete')
      .mockResolvedValue([{}]);

    const result = await service.deleteExpenditure(1, user);
    expect(result).toEqual({ message: '성공적으로 지출 삭제를 완료했습니다.' });
    expect(expenditureDeleteSpy).toBeCalledTimes(1);
  });

  it('Expenditure delete Error', async () => {
    jest.spyOn(mockExpenditureRepository, 'delete').mockResolvedValue(null);
    try {
      await service.deleteExpenditure(1, user);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });
});
