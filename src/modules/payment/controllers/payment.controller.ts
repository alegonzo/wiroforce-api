import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { EntumovilDto } from '../dto/entumovil.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { EventPattern } from '@nestjs/microservices';
import { CREATE_ENTUMOVIL_PAYMENT } from '../utils/constants';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /*@UseGuards(ThrottlerGuard)
  @Throttle(1000, 60)
  @Post('entumovil')
  async entumovilPayment(@Body() entumovilDto: EntumovilDto) {
    await this.paymentService.saveEntumovilPayment(entumovilDto);
    return { status: 200, message: 'Pago registrado correctamente' };
  }*/

  @EventPattern(CREATE_ENTUMOVIL_PAYMENT)
  async createEntumovilPayment(data: EntumovilDto) {
    await this.paymentService.saveEntumovilPayment(data);
  }
}
