import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { EntumovilDto } from '../dto/entumovil.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('entumovil')
  entumovilPayment(@Body() entumovilDto: EntumovilDto) {
    return this.paymentService.saveEntumovilPayment(entumovilDto);
  }
}
