import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { MinioClientService } from './common/clients/minio.client.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
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
  /*const options = new DocumentBuilder()
    .setTitle('Wiro Force Api')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);*/


  await app.listen(configService.get<number>('APP_PORT'));
}
bootstrap();
