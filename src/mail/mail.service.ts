import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { MailInfoTemplate } from './mail-info.interface';
import { environment } from '../environment/environment';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMailInfo(options: ISendMailOptions, mailInfoTemplate: MailInfoTemplate): Promise<void> {
    await this.mailerService.sendMail({
      ...options,
      from: environment.get('MAIL'),
      template: 'info',
      context: {
        title: mailInfoTemplate.title,
        version: environment.appVersion,
        year: new Date().getFullYear(),
        info: mailInfoTemplate.info,
      },
    });
  }
}
