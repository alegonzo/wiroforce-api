import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailToUser(user: User, subject: string, info: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: subject,
      template: './to_user',
      context: {
        name: user.fullName,
        info: info,
      },
    });
  }

  async sendEmailToAdmin(subject: string, info: string) {
    await this.mailerService.sendMail({
      to: 'alegonzo97@gmail.com',
      subject: subject,
      template: './to_admin',
      context: {
        info: info,
      },
    });
  }
}
