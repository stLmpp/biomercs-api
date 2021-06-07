import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { MailInfoTemplate } from './mail-info.interface';
import { environment } from '../environment/environment';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMailInfo(options: ISendMailOptions, mailInfoTemplate: MailInfoTemplate): Promise<void> {
    options = { ...options };
    options.from ??= environment.mail;
    await this.mailerService.sendMail({
      ...options,
      template: './info.hbs',
      context: {
        title: mailInfoTemplate.title,
        version: environment.appVersion,
        year: new Date().getFullYear(),
        info: mailInfoTemplate.info,
      },
    });
  }
}
