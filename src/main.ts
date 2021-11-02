import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { useContainer } from 'class-validator';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { MinioClientService } from './common/clients/minio.client.service';
import { PaymentService } from './modules/payment/services/payment.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.get(ConfigService);

  const minioConfig = app.get(MinioClientService);
  //await minioConfig.createDefaultBucket();
  //await minioConfig.createSecretBucket();
  await minioConfig.setPublicPolicy();

  //RabbitMQ
  const user = configService.get('RABBITMQ_USER');
  const password = configService.get('RABBITMQ_PASSWORD');
  const host = configService.get('RABBITMQ_HOST');
  const queueName = configService.get('RABBITMQ_QUEUE_NAME');

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${password}@${host}`],
      queue: queueName,
      queueOptions: {
        durable: true,
      },
    },
  });
  await app.startAllMicroservicesAsync();
  const paymentService = app.get(PaymentService);
  await paymentService.createPaymentsFromEntumovil();
  //await paymentService.fixDates();

  //Swagger setup
  /*const options = new DocumentBuilder()
    .setTitle('Wiro Force Api')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);*/

  await app.listen(configService.get<number>('APP_PORT'));
}
bootstrap();
