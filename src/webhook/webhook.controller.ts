import { Controller, Get } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('컨설팅 테스트')
@Controller('webhook')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @ApiOperation({ summary: '오늘 지출 추천 컨설팅 테스트 API' })
  @Get()
  async getTestMorningConsult() {
    await this.webhookService.morningSchedule();
  }

  @ApiOperation({ summary: '오늘 지출 안내 컨설팅 테스트 API' })
  @Get()
  async getTestEveningConsult() {
    await this.webhookService.eveningSchedule();
  }
}
