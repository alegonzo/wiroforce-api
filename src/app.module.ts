import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { ApplicationModule } from './modules/application/application.module';
import { AuthModule } from './modules/auth/auth.module';
import { PaymentModule } from './modules/payment/payment.module';
import { MobileModule } from './modules/mobile/mobile.module';
import { CompanyModule } from './modules/company/company.module';
import { ClientsModule } from './common/clients/clients.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { MailModule } from './modules/mail/mail.module';
import { RankingModule } from './modules/ranking/ranking.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 120,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER') || '',
        password: configService.get<string>('DB_PASSWORD') || '',
        database: configService.get<string>('DB_NAME'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    MulterModule.register(),
    UserModule,
    ProductModule,
    ApplicationModule,
    AuthModule,
    PaymentModule,
    MobileModule,
    CompanyModule,
    ClientsModule,
    HealthCheckModule,
    MailModule,
    RankingModule,
  ],
})
export class AppModule {}
