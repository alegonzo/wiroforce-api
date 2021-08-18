import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(user: User, subject: string, info: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: subject,
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        name: user.fullName,
        info: info,
      },
    });
  }
}
