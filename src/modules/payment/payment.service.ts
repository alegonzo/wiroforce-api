import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationService } from '../application/services/application.service';
import { ProductService } from '../product/services/product.service';
import { EntumovilDto } from './dto/entumovil.dto';
import { EntumovilPayment } from './entities/entumovil-payment.entity';
import { Payment } from './entities/payment.entity';
import * as PaymentValues from './utils/payment-values';
import { PaymentVia } from './utils/via.enum';
import * as crypto from 'crypto';


@Injectable()
export class PaymentService {

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(EntumovilPayment)
    private entumovilPaymentRepository: Repository<EntumovilPayment>,
    private applicationService: ApplicationService,
    private productService: ProductService,
    private httpService: HttpService
  ) { }

  async saveEntumovilPayment(entumovilDto: EntumovilDto) {
    await this.entumovilPaymentRepository.save(new EntumovilPayment({
      msgId: entumovilDto.id,
      body: entumovilDto.mstext,
      phoneSender: entumovilDto.msisdn,
      entumovilPhone: entumovilDto.sender
    }));
    const smsBodyData = entumovilDto.mstext.split(' ');
    const application = smsBodyData.length > 1
      ? await this.applicationService.findOneByAppId(smsBodyData[1]) : null;
    const product = application && smsBodyData.length > 2
      ? await this.productService.findOneByItemId(smsBodyData[2]) : null;
    const channel = smsBodyData.length === 4 ? smsBodyData[4] : null;

    if (product) {
      const totalAmount = entumovilDto.sender === PaymentValues.shortNumber4
        ? PaymentValues.shortNumber4Price * PaymentValues.entumovilFee
        : PaymentValues.shortNumber25Price * PaymentValues.entumovilFee;
      await this.paymentRepository.save(new Payment({
        product: product,
        totalAmount: totalAmount * PaymentValues.entumovilFee,
        clientAmount: totalAmount * PaymentValues.clientFee,
        platformAmount: totalAmount * PaymentValues.entumovilFee * PaymentValues.platformFee,
        via: PaymentVia.ENTUMOVIL,
        userHash: crypto.createHash('sha1').update(entumovilDto.msisdn, 'utf-8').digest('hex')
      }));
    }

    const id = crypto.randomBytes(16).toString("hex");
    const stringToHash = `conwiro:F7C3BC1D808E04732ADF679965CCC34CA7AE3441:cubacel:${id}:${entumovilDto.id}:${entumovilDto.mstext}`;
    const hash = crypto.createHash('sha1').update(stringToHash, 'utf-8').digest('hex').toUpperCase();
    const body = `userId=conwiro&hash=${hash}&smscId=cubacel&id=${id}&recipient=${entumovilDto.id}&mstext=${entumovilDto.mstext}`;
    return this.httpService.post(PaymentValues.entumovilUrl, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).toPromise();
  }

}
