import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BudgetModule } from './budget/budget.module';
import { ExpenditureModule } from './expenditure/expenditure.module';
import { CategoryModule } from './category/category.module';
import { ConsultingModule } from './consulting/consulting.module';
import { StatisticsModule } from './statistics/statistics.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // validationSchema,
      load: [],
      cache: true,
      envFilePath: [
        process.env.NODE_ENV === 'production'
          ? '.production.env'
          : '.development.env',
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        await typeORMConfig(configService),
    }),
    AuthModule,
    UserModule,
    BudgetModule,
    ExpenditureModule,
    CategoryModule,
    ConsultingModule,
    StatisticsModule,
    WebhookModule,
  ],
})
export class AppModule {}
