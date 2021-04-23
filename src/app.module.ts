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


@Module({
    imports: [
        MulterModule.register(),
        UserModule,
        ProductModule,
        ApplicationModule,
        AuthModule,
        PaymentModule,
        MobileModule],
    controllers: [

    ],
    providers: [

    ],
})
export class AppModule { }
