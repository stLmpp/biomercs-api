import { Injectable } from '@nestjs/common';
import { Environment } from '../environment/environment';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { SendRawEmailCommand, SES } from '@aws-sdk/client-ses';
import { resolve } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Injectable()
export class MailerConfig implements MailerOptionsFactory {
  constructor(private environment: Environment) {}

  private readonly _awsSES = new SES({
    apiVersion: this.environment.get('AWS_MAIL_API_VERSION'),
    region: this.environment.get('AWS_REGION'),
    credentials: {
      accessKeyId: this.environment.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.environment.get('AWS_SECRET_ACCESS_KEY'),
    },
  });

  createMailerOptions(): MailerOptions {
    return {
      transport: {
        SES: {
          ses: this._awsSES,
          aws: { SendRawEmailCommand }, // https://github.com/nodemailer/nodemailer/issues/1293
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
