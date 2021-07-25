import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { MailModule } from '../mail/mail.module';
import { EnvironmentModule } from '../environment/environment.module';

@Module({
  imports: [MailModule, EnvironmentModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
