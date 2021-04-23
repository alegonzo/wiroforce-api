import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { ApplicationModule } from '../application/application.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ClientsModule } from '../../common/clients/clients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ApplicationModule,
    ClientsModule
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule { }
