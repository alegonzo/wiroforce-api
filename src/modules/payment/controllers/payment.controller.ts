import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { EntumovilDto } from '../dto/entumovil.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('entumovil')
  async entumovilPayment(@Body() entumovilDto: EntumovilDto) {
    await this.paymentService.saveEntumovilPayment(entumovilDto);
    return { status: 200, message: "Pago registrado correctamente" };
  }
}
