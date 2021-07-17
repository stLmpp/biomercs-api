import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { ContactSendMailDto } from './contact.dto';
import { Environment } from '../environment/environment';

@Injectable()
export class ContactService {
  constructor(private mailService: MailService, private environment: Environment) {}

  async sendMail({ from, body, subject }: ContactSendMailDto): Promise<void> {
    await this.mailService.sendMailInfo(
      { to: this.environment.get('MAIL_ADDRESS'), subject },
      {
        title: 'Contact',
        info: [
          { title: 'From', value: from },
          { title: 'Message', value: body },
        ],
      }
    );
  }
}
