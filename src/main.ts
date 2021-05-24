import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { MinioClientService } from './common/clients/minio.client.service';
import { PaymentService } from './modules/payment/services/payment.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.get(ConfigService);

  const minioConfig = app.get(MinioClientService);
  await minioConfig.createDefaultBucket();
  await minioConfig.setPublicPolicy();

  //const paymentService = app.get(PaymentService);
  //await paymentService.loadData();
  //await paymentService.createPaymentsFromEntumovil();

  //Swagger setup
  const options = new DocumentBuilder()
    .setTitle('Wiro Force Api')
    //.setDescription('The cats API description')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);


  await app.listen(configService.get<number>('APP_PORT'));
}
bootstrap();
