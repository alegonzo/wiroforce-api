import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationService } from '../../application/services/application.service';
import { ProductService } from '../../product/services/product.service';
import { EntumovilDto } from '../dto/entumovil.dto';
import { EntumovilPayment } from '../entities/entumovil-payment.entity';
import { Payment } from '../entities/payment.entity';
import * as PaymentValues from '../utils/payment-values';
import { PaymentVia } from '../utils/via.enum';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { sub } from 'date-fns';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(EntumovilPayment)
    private entumovilPaymentRepository: Repository<EntumovilPayment>,
    private applicationService: ApplicationService,
    private productService: ProductService,
  ) {}

  async saveEntumovilPayment(entumovilDto: EntumovilDto): Promise<void> {
    await this.entumovilPaymentRepository.save(
      new EntumovilPayment({
        msgId: entumovilDto.id,
        body: entumovilDto.mstext,
        phoneSender: entumovilDto.msisdn,
        entumovilPhone: entumovilDto.sender,
        createdAt: sub(new Date(), { hours: 4 }),
      }),
    );
    const smsBodyData = entumovilDto.mstext.split(' ');
    const application =
      smsBodyData.length > 1
        ? await this.applicationService.findOneByAppId(smsBodyData[1])
        : null;
    const product =
      application && smsBodyData.length > 2
        ? await this.productService.findOneByItemId(smsBodyData[2])
        : null;
    const channel = smsBodyData.length === 4 ? smsBodyData[4] : null;

    if (product) {
      const realAmount =
        entumovilDto.sender === PaymentValues.shortNumber4
          ? PaymentValues.shortNumber4Price * PaymentValues.entumovilFee
          : PaymentValues.shortNumber25Price * PaymentValues.entumovilFee;
      await this.paymentRepository.save(
        new Payment({
          product: product,
          originalAmount:
            entumovilDto.sender === PaymentValues.shortNumber4
              ? PaymentValues.shortNumber4Price
              : PaymentValues.shortNumber25Price,
          clientAmount: realAmount,
          via: PaymentVia.ENTUMOVIL,
          userHash: crypto
            .createHash('sha1')
            .update(entumovilDto.msisdn, 'utf-8')
            .digest('hex'),
          createdAt: sub(new Date(), { hours: 4 }),
        }),
      );
    }
  }

  //Legacy

  async loadData() {
    const json = JSON.parse(fs.readFileSync('./payments.json').toString());
    const data = json.data;
    for (let i = 0; i < data.length; i++) {
      const entumovilPayment = new EntumovilDto();
      entumovilPayment.id = data[i].msgId;
      entumovilPayment.msisdn = data[i].phoneSender;
      entumovilPayment.mstext = data[i].body;
      entumovilPayment.sender = data[i].entumovilPhone;
      entumovilPayment.createdAt = data[i].createdAt;
      await this.entumovilPaymentRepository.save(
        new EntumovilPayment({
          msgId: entumovilPayment.id,
          body: entumovilPayment.mstext,
          phoneSender: entumovilPayment.msisdn,
          entumovilPhone: entumovilPayment.sender,
          createdAt: entumovilPayment.createdAt,
        }),
      );
      console.log(i);
    }
  }

  async createPaymentsFromEntumovil() {
    const json = JSON.parse(fs.readFileSync('./payments.json').toString());
    const data = json.data;
    for (let i = 0; i < data.length; i++) {
      const entumovilPayment = new EntumovilDto();
      entumovilPayment.id = data[i].msgId;
      entumovilPayment.msisdn = data[i].phoneSender;
      entumovilPayment.mstext = data[i].body;
      entumovilPayment.sender = data[i].entumovilPhone;
      entumovilPayment.createdAt = data[i].createdAt;
      const smsBodyData = entumovilPayment.mstext.split(' ');
      const application =
        smsBodyData.length > 1
          ? await this.applicationService.findOneByAppId(smsBodyData[1])
          : null;
      const product =
        application && smsBodyData.length > 2
          ? await this.productService.findOneByItemId(smsBodyData[2])
          : null;
      const channel = smsBodyData.length === 4 ? smsBodyData[4] : null;

      if (product) {
        const totalAmount =
          entumovilPayment.sender === PaymentValues.shortNumber4
            ? PaymentValues.shortNumber4Price * PaymentValues.entumovilFee
            : PaymentValues.shortNumber25Price * PaymentValues.entumovilFee;
        await this.paymentRepository.save(
          new Payment({
            product: product,
            originalAmount:
              entumovilPayment.sender === PaymentValues.shortNumber4
                ? PaymentValues.shortNumber4Price
                : PaymentValues.shortNumber25Price,
            clientAmount: totalAmount,
            via: PaymentVia.ENTUMOVIL,
            userHash: crypto
              .createHash('sha1')
              .update(entumovilPayment.msisdn, 'utf-8')
              .digest('hex'),
            createdAt: data[i].createdAt,
          }),
        );
      }
      console.log(i);
    }
  }
}
