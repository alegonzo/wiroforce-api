import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { EntumovilDto } from '../dto/entumovil.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Throttle(1000, 60)
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('entumovil')
  async entumovilPayment(@Body() entumovilDto: EntumovilDto) {
    await this.paymentService.saveEntumovilPayment(entumovilDto);
    return { status: 200, message: "Pago registrado correctamente" };
  }
}
