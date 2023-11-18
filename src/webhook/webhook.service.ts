import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { WebhookRepository } from './webhook.repository';
import {
  getDateDiff,
  arrayToObject,
  truncationWon,
  calculatePercentage,
  amountForm,
} from 'src/common/utils';
import { payloads } from './discord.payload';

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
  ): { canUseTotal: number; condition: string } {
    let condition = '';

    // 지출 총액
    const expenditureTotal = expenditures.reduce(
      (acc, cur) => acc + Number(cur['total_price']),
      0,
    );

    const canUseTotal =
      total_budget - expenditureTotal < 0 ? 0 : total_budget - expenditureTotal;

    const averageAmount = truncationWon((total_budget / allDays) * days, 100);

    if (expenditureTotal <= averageAmount * 0.7) condition = 'good';
    else if (
      expenditureTotal > averageAmount * 0.7 &&
      expenditureTotal <= averageAmount
    )
      condition = 'proper';
    else if (
      expenditureTotal > averageAmount &&
      expenditureTotal < total_budget
    )
      condition = 'warning';
    else if (expenditureTotal >= total_budget) condition = 'danger';

    return { canUseTotal, condition };
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

      result[budget['category']] = value;
    });
    return result;
  }

  @Cron(`0 0 8 * * *`, { name: 'morningCronTask' })
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

        const allDays: number = getDateDiff(
          user['start_date'],
          user['end_date'],
        );
        const days: number = this.getStartingPeriod(user['start_date']);

        const conditions: { canUseTotal: number; condition: string } =
          this.getUsersCondition(user['total'], allDays, days, expenditure);

        const payload = [
          {
            name: `총합 : ${amountForm(conditions.canUseTotal)}₩`,
            value: '',
            inline: true,
          },
        ];

        for (const key in result) {
          payload[0].value += `${key} : ₩${amountForm(result[key])} \n `;
        }

        const message = payloads.MORNING_CONSULTING(
          payload,
          conditions.condition,
        );

        this.sendDiscord(user['discord_url'], message);
      });

      return users;
    } catch (error) {
      console.log(error);
    }
  }

  // 오늘 사용했을 적정 금액
  getAdequateAmount(
    budgets: object[],
    beforeExpenditureObject: object,
    endDate: Date,
  ) {
    // (오늘기준) 종료일자까지 남은 기간
    const remainingPeriod = this.getRemainingPeriod(endDate);
    const adequateAmount = {};

    //적정 금액 구하기 ((카테고리별 예산 - 여태까지 쓴 금액) /  남은 일자)
    budgets.forEach((budget) => {
      const adequateCategory = beforeExpenditureObject[budget['category']]
        ? Number(beforeExpenditureObject[budget['category']])
        : 0;

      const amount = truncationWon(
        (Number(budget['total_price']) - adequateCategory) / remainingPeriod,
        100,
      );
      adequateAmount[budget['category']] = amount < 0 ? 0 : amount;
    });

    return adequateAmount;
  }

  // 오늘 사용했을 적정 금액 퍼센티지
  getAdequatePercentage(
    expenditureToday: object[],
    adequateAmount: object,
  ): object {
    const adequatePercentage = {};

    // 적정 금액과 지출 금액 비교
    expenditureToday.forEach((expenditure) => {
      const todayMoney = Number(expenditure['total_price']);
      const adequateMoney = adequateAmount[expenditure['category']]
        ? adequateAmount[expenditure['category']]
        : 0;

      const percentage = calculatePercentage(todayMoney, adequateMoney);

      adequatePercentage[expenditure['category']] =
        percentage < 0 ? '❌' : percentage + '%';
    });

    return adequatePercentage;
  }

  async sendDiscord(discordUrl: string, data: object) {
    await this.httpService.post(discordUrl, data).subscribe({
      complete: () => {
        console.log('completed');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  @Cron(`0 0 20 * * *`, { name: 'eveningCronTask' })
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

        const today = new Date(new Date().setHours(0, 0, 0, 0));

        // 유저가 지출한 카테고리별 금액 불러오기
        const expenditureToday =
          await this.webhookRepository.getUsersExpenditure(
            user['user_id'],
            today,
            today,
          );

        //유저의 당일 지출이 없다면 발송 안하고 다음 유저로
        if (!expenditureToday.length) return;
        const expenditureTodayObject = arrayToObject(expenditureToday); //오늘 지출 객체
        const yesterday = new Date(today.setDate(today.getDate() - 1));

        // 유저가 어제까지 지출한 카테고리별 금액 불러오기
        const beforeExpenditure =
          await this.webhookRepository.getUsersExpenditure(
            user['user_id'],
            user['start_date'],
            yesterday,
          );
        const beforeExpenditureObject = arrayToObject(beforeExpenditure); //여태 지출 객체

        const amount = this.getAdequateAmount(
          budget,
          beforeExpenditureObject,
          user['end_date'],
        );

        const percentage = this.getAdequatePercentage(expenditureToday, amount);

        const payload = [
          {
            name: `💰적정 금액`,
            value: '',
            inline: true,
          },
          {
            name: `💸지출 금액`,
            value: '',
            inline: true,
          },
          {
            name: `❗️위험도`,
            value: '',
            inline: true,
          },
        ];

        // 적정금액 필드
        for (const key in amount) {
          payload[0].value += `${key} : ₩${amountForm(amount[key])} \n `;
        }

        // 적정비율 필드
        for (const key in expenditureTodayObject) {
          payload[1].value += `${key} : ₩${amountForm(
            expenditureTodayObject[key],
          )} \n `;

          payload[2].value += `(${percentage[key]}) \n `;
        }

        const message = payloads.EVENING_CONSULTING(payload);

        this.sendDiscord(user['discord_url'], message);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
