import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const typeORMConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOSTNAME') || 'localhost',
    port: parseInt(configService.get<string>('DB_PORT')) || 5432,
    username: configService.get<string>('DB_USERNAME') || 'postgres',
    password: configService.get<string>('DB_PASSWORD') || 'password',
    database: configService.get<string>('DB_DATABASE') || 'dollarguard',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: configService.get<boolean>('DB_SYNCHRONIZE') || true,
    namingStrategy: new SnakeNamingStrategy(),
    // logging: true,
  };
};
