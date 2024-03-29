import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CompanyModule } from '../company/company.module';
import { UserExistsRule } from './validation/user-exists.rule';
import { CompanyExistsRule } from './validation/company-exists.rule';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CompanyModule, MailModule],
  controllers: [UserController],
  providers: [UserService, UserExistsRule, CompanyExistsRule],
  exports: [UserService],
})
export class UserModule {}
