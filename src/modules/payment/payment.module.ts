import { HttpModule, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ApplicationModule } from '../application/application.module';
import { ProductModule } from '../product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { EntumovilPayment } from './entities/entumovil-payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      EntumovilPayment
    ]),
    ApplicationModule,
    ProductModule,
    HttpModule],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule { }
