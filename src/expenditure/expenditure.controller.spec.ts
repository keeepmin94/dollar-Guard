import { Test, TestingModule } from '@nestjs/testing';
import { ExpenditureController } from './expenditure.controller';
import { ExpenditureService } from './expenditure.service';
import { User } from 'src/user/entities/user.entity';
import {
  ExpenditureCreateDto,
  ExpenditureUpdateDto,
  ExpenditureListDto,
} from './dto/expenditure.dto';

describe('ExpenditureController', () => {
  let controller: ExpenditureController;
  const mockExpenditureService = {
    createExpenditure: jest.fn(),
    updateExpenditure: jest.fn(),
    deleteExpenditure: jest.fn(),
    getExpenditureList: jest.fn(),
    getExpenditureDetail: jest.fn(),
    getPreMonthPercentage: jest.fn(),
    getPreWeekPercentage: jest.fn(),
    getUsersExpenditureStatistics: jest.fn(),
  };
  const user = new User();

  const createDto: ExpenditureCreateDto = {
    amountSpent: 5000,
    spentDate: new Date('2023-11-30'),
    memo: 'test',
    exceptYn: true,
    category: '식비',
  };
  const updateDto: ExpenditureUpdateDto = {
    amountSpent: 5000,
    spentDate: new Date('2023-11-30'),
    memo: 'test',
    exceptYn: true,
  };
  const listDto: ExpenditureListDto = {
    startDate: new Date('2023-11-01'),
    endDate: new Date('2023-11-30'),
  };

  const createExpenditureSpy = jest
    .spyOn(mockExpenditureService, 'createExpenditure')
    .mockResolvedValue({});

  const updateExpenditureSpy = jest
    .spyOn(mockExpenditureService, 'updateExpenditure')
    .mockResolvedValue({});

  const deleteExpenditureSpy = jest
    .spyOn(mockExpenditureService, 'deleteExpenditure')
    .mockResolvedValue({});

  const getExpenditureListSpy = jest
    .spyOn(mockExpenditureService, 'getExpenditureList')
    .mockResolvedValue({});

  const getExpenditureDetailSpy = jest
    .spyOn(mockExpenditureService, 'getExpenditureDetail')
    .mockResolvedValue({});

  const getPreMonthPercentageSpy = jest
    .spyOn(mockExpenditureService, 'getPreMonthPercentage')
    .mockResolvedValue({});

  const getPreWeekPercentageSpy = jest
    .spyOn(mockExpenditureService, 'getPreWeekPercentage')
    .mockResolvedValue({});

  const getUsersExpenditureStatisticsSpy = jest
    .spyOn(mockExpenditureService, 'getUsersExpenditureStatistics')
    .mockResolvedValue({});

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenditureController],
      providers: [
        { provide: ExpenditureService, useValue: mockExpenditureService },
      ],
    }).compile();

    controller = module.get<ExpenditureController>(ExpenditureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('createExpenditure', async () => {
    const rst = await controller.createExpenditure(createDto, user);
    expect(rst).toEqual({});
    expect(createExpenditureSpy).toBeCalledTimes(1);
  });

  it('updateExpenditure', async () => {
    const rst = await controller.updateExpenditure(1, updateDto, user);
    expect(rst).toEqual({});
    expect(updateExpenditureSpy).toBeCalledTimes(1);
  });

  it('deleteExpenditure', async () => {
    const rst = await controller.deleteExpenditure(1, user);
    expect(rst).toEqual({});
    expect(deleteExpenditureSpy).toBeCalledTimes(1);
  });

  it('getExpenditureList', async () => {
    const rst = await controller.getExpenditureList(listDto, user);
    expect(rst).toEqual({});
    expect(getExpenditureListSpy).toBeCalledTimes(1);
  });

  it('getExpenditureDetail', async () => {
    const rst = await controller.getExpenditureDetail(1, user);
    expect(rst).toEqual({});
    expect(getExpenditureDetailSpy).toBeCalledTimes(1);
  });

  it('getPreMonthPercentage', async () => {
    const rst = await controller.getPreMonthPercentage(user);
    expect(rst).toEqual({});
    expect(getPreMonthPercentageSpy).toBeCalledTimes(1);
  });

  it('getPreWeekPercentage', async () => {
    const rst = await controller.getPreWeekPercentage(user);
    expect(rst).toEqual({});
    expect(getPreWeekPercentageSpy).toBeCalledTimes(1);
  });

  it('getUsersExpenditureStatistics', async () => {
    const rst = await controller.getUsersExpenditureStatistics(user);
    expect(rst).toEqual({});
    expect(getUsersExpenditureStatisticsSpy).toBeCalledTimes(1);
  });
});

/*
createExpenditure
updateExpenditure
deleteExpenditure
getExpenditureList
getPreMonthPercentage
getUsersExpenditureStatistics
getExpenditureDetail
*/
