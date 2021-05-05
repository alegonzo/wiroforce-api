import { HttpModule, Module } from '@nestjs/common';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './controllers/payment.controller';
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
