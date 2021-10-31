import { Injectable } from '@nestjs/common';
import { Environment } from '../environment/environment';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { resolve } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Injectable()
export class MailerConfig implements MailerOptionsFactory {
  constructor(private environment: Environment) {}

  createMailerOptions(): MailerOptions {
    return {
      transport: {
        host: this.environment.get('MAIL_HOST'),
        port: this.environment.get('MAIL_PORT'),
        auth: {
          user: this.environment.get('MAIL_ADDRESS'),
          pass: this.environment.get('MAIL_PASS'),
        },
      },
      defaults: {
        from: `"Biomercs" <${this.environment.get('MAIL_ADDRESS')}>`,
      },
      template: {
        dir: resolve(process.cwd() + '/mail/templates/'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}
