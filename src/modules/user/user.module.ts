import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CompanyModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
