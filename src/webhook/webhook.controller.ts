import { Controller, Get } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Get()
  async getTestMorningConsult(): Promise<object[]> {
    return await this.webhookService.morningSchedule();
  }
}
