import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { WebhookRepository } from './webhook.repository';
import { getDateDiff } from 'src/common/utils';

@Injectable()
export class WebhookService {
  private minimumAmount = 1000;
  private truncation = 100;
  constructor(
    private httpService: HttpService,
    private webhookRepository: WebhookRepository,
  ) {}

  // 오늘부터 예산 설정 종료일까지 일수 구하기
  getRemainingPeriod(endDate: Date): number {
    const today = new Date();
    return getDateDiff(today, endDate);
  }
  // 예산 설정 시작일부터 오늘까지 일수 구하기
  getStartingPeriod(startDate: Date): number {
    const today = new Date();
    return getDateDiff(startDate, today);
  }

  //유저의 알맞은 예산 상황 메세지 구하기
  getUsersCondition(
    total: number,
    allDays: number,
    days: number,
    expenditures: object[],
  ): { expenditureTotal: number; message: string } {
    let message = '';

    // 지출 총액
    const expenditureTotal = expenditures.reduce(
      (acc, cur) => acc + Number(cur['total_price']),
      0,
    );

    const averageAmount =
      Math.floor(((total / allDays) * days) / this.truncation) *
      this.truncation;

    if (expenditureTotal <= averageAmount * 0.7)
      message = '아주 잘 아끼고 있습니다!';
    else if (
      expenditureTotal > averageAmount * 0.7 &&
      expenditureTotal <= averageAmount
    )
      message = '충분히 잘 아끼고 있어요!';
    else if (expenditureTotal > averageAmount && expenditureTotal < total)
      message = '하루 소비량이 기준치를 넘었어요! ';
    else if (expenditureTotal >= total)
      message = '소비량이 총 예산을 넘었어요! ';

    return { expenditureTotal, message };
  }

  getChooseExpenditure(
    budgets: object[],
    expenditures: object[],
    endDate: Date,
  ): object[] {
    const result = [];

    budgets.forEach((budget) => {
      const gapAmount = { amount: 0, category: '' };
      //카테고리별 지출 예산
      const exAmount = expenditures['total_price']
        ? Number(expenditures['total_price'])
        : 0;
      //카테고리별 설정 예산 - 지출 예산
      const gap = Number(budget['total_price']) - exAmount;
      // (오늘기준) 종료일자까지 남은 기간
      const remainingPeriod = this.getRemainingPeriod(endDate);
      // n단위 절사
      const won =
        Math.floor(gap / remainingPeriod / this.truncation) * this.truncation;
      // 너무 적은 금액일시 최소금액으로 추천
      const value = won >= this.minimumAmount ? won : this.minimumAmount;
      gapAmount.amount = value;
      gapAmount.category = budget['category'];
      result.push(gapAmount);
    });
    return result;
  }

  //@Cron(`0 0 8 * * *`, { name: 'morningCronTask' })
  //@Cron(`0 35 * * * *`, { name: 'morningCronTask' })
  async morningSchedule(): Promise<object[]> {
    try {
      const users = await this.webhookRepository.getMorningConsultingUsers();

      users.forEach(async (user) => {
        // 유저가 설정한 카테고리별 예산 불러오기
        const budget = await this.webhookRepository.getUsersBudget(
          user['budget_id'],
        );

        // 유저가 지출한 카테고리별 금액 불러오기
        const expenditure = await this.webhookRepository.getUsersExpenditure(
          user['user_id'],
          user['start_date'],
          user['end_date'],
        );

        // 예산, 지출 계산해 하루 사용 금액 조회
        const result = this.getChooseExpenditure(
          budget,
          expenditure,
          user['end_date'],
        );
        console.log(result);

        const allDays: number = getDateDiff(
          user['start_date'],
          user['end_date'],
        );
        const days: number = this.getStartingPeriod(user['start_date']);

        const condition: { expenditureTotal: number; message: string } =
          this.getUsersCondition(user['total'], allDays, days, expenditure);

        console.log(condition);
      });

      return users;
    } catch (error) {
      console.log(error);
    }
  }

  @Cron(`0 0 8 * * *`, { name: 'eveningCronTask' })
  async eveningSchedule() {
    try {
    } catch (error) {
      console.log(error);
    }
  }
}
