import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { ContactSendMailDto } from './contact.dto';
import { environment } from '../environment/environment';

@Injectable()
export class ContactService {
  constructor(private mailService: MailService) {}

  async sendMail({ from, body, subject }: ContactSendMailDto): Promise<void> {
    await this.mailService.sendMailInfo(
      { to: environment.mail, subject },
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
