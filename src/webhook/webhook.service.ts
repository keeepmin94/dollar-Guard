import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { WebhookRepository } from './webhook.repository';
import { getDateDiff, arrayToObject, truncationWon } from 'src/common/utils';

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
    total_budget: number,
    allDays: number,
    days: number,
    expenditures: object[],
  ): { canUseTotal: number; message: string } {
    let message = '';

    // 지출 총액
    const expenditureTotal = expenditures.reduce(
      (acc, cur) => acc + Number(cur['total_price']),
      0,
    );

    const canUseTotal =
      total_budget - expenditureTotal < 0 ? 0 : total_budget - expenditureTotal;

    const averageAmount = truncationWon((total_budget / allDays) * days, 100);

    if (expenditureTotal <= averageAmount * 0.7)
      message = '아주 잘 아끼고 있습니다! 오늘도 화이팅!';
    else if (
      expenditureTotal > averageAmount * 0.7 &&
      expenditureTotal <= averageAmount
    )
      message = '충분히 잘 아끼고 있어요! 오늘도 열심히!';
    else if (
      expenditureTotal > averageAmount &&
      expenditureTotal < total_budget
    )
      message = '하루 소비량이 기준치를 넘었어요! 오늘은 아껴쓰세요!';
    else if (expenditureTotal >= total_budget)
      message = '소비량이 총 예산을 넘었어요! 절약!';

    return { canUseTotal, message };
  }

  getChooseExpenditure(
    budgets: object[],
    expenditures: object[],
    endDate: Date,
  ): object {
    const expendituresObject = arrayToObject(expenditures);
    const result = {};
    budgets.forEach((budget) => {
      //카테고리별 지출 예산
      const exAmount = expendituresObject[budget['category']]
        ? Number(expendituresObject[budget['category']])
        : 0;
      //카테고리별 설정 예산 - 지출 예산
      const gap = Number(budget['total_price']) - exAmount;
      // (오늘기준) 종료일자까지 남은 기간
      const remainingPeriod = this.getRemainingPeriod(endDate);
      // n단위 절사
      const won = truncationWon(gap / remainingPeriod, 100);

      // 너무 적은 금액일시 최소금액으로 추천
      const value = won >= this.minimumAmount ? won : this.minimumAmount;
      //   gapAmount.amount = value;
      //   gapAmount.category = budget['category'];
      //   result.push(gapAmount);
      result[budget['category']] = value;
    });
    return result;
  }

  //@Cron(`0 0 8 * * *`, { name: 'morningCronTask' })
  //@Cron(`0 35 * * * *`, { name: 'morningCronTask' })
  async morningSchedule(): Promise<object[]> {
    try {
      const users = await this.webhookRepository.getMorningConsultingUsers(
        'morning_consulting_yn',
      );

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

        const condition: { canUseTotal: number; message: string } =
          this.getUsersCondition(user['total'], allDays, days, expenditure);

        console.log(condition);
      });

      return users;
    } catch (error) {
      console.log(error);
    }
  }

  //   getAdequateAmount(
  //     budgets: object[],
  //     expenditureToday: object[],
  //     beforeExpenditure: object[],
  //   ) {
  //     expenditureToday.forEach((expenditure) => {
  //       const budgetAmount = budgets[expenditure['category']];
  //     });
  //   }

  @Cron(`0 0 8 * * *`, { name: 'eveningCronTask' })
  async eveningSchedule() {
    try {
      const users = await this.webhookRepository.getMorningConsultingUsers(
        'evening_consulting_yn',
      );
      users.forEach(async (user) => {
        // 유저가 설정한 카테고리별 예산 불러오기
        const budget = await this.webhookRepository.getUsersBudget(
          user['budget_id'],
        );

        const today = new Date();

        // 유저가 지출한 카테고리별 금액 불러오기
        const expenditureToday =
          await this.webhookRepository.getUsersTodayExpenditure(
            user['user_id'],
            today,
          );

        //유저의 당일 지출이 없다면 발송 안하고 다음 유저로
        if (!expenditureToday) return;

        const yesterday = new Date(today.setDate(today.getDate() - 1));

        // 유저가 어제까지 지출한 카테고리별 금액 불러오기
        const beforeExpenditure =
          await this.webhookRepository.getUsersExpenditure(
            user['user_id'],
            user['start_date'],
            yesterday,
          );
      });
    } catch (error) {
      console.log(error);
    }
  }
}
