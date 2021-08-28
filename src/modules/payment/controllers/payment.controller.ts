import { Controller } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { EntumovilDto } from '../dto/entumovil.dto';
import { EventPattern } from '@nestjs/microservices';
import { CREATE_ENTUMOVIL_PAYMENT } from '../utils/constants';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @EventPattern(CREATE_ENTUMOVIL_PAYMENT)
  async createEntumovilPayment(data: EntumovilDto) {
    await this.paymentService.saveEntumovilPayment(data);
  }
}
