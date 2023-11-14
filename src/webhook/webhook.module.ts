import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { WebhookRepository } from './webhook.repository';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule],
  providers: [WebhookService, WebhookRepository],
  controllers: [WebhookController],
})
export class WebhookModule {}
