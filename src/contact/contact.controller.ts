import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { ContactSendMailDto } from './contact.dto';
import { RateLimit } from 'nestjs-rate-limiter';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @RateLimit({
    keyPrefix: 'contact/send-mail',
    points: 1,
    duration: 60 * 15, // 15 minutes
    errorMessage:
      'It appears you already sent a message some minutes ago, please wait a while before trying to send another',
  })
  @Post('send-mail')
  async sendMail(@Body() dto: ContactSendMailDto): Promise<void> {
    await this.contactService.sendMail(dto);
  }
}
