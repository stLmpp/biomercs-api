import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailQueueRepository } from './mail-queue.repository';
import { MailController } from './mail.controller';
import { MailerConfig } from './mailer.config';
import { EnvironmentModule } from '../environment/environment.module';

@Module({
  imports: [TypeOrmModule.forFeature([MailQueueRepository]), EnvironmentModule],
  controllers: [MailController],
  providers: [MailService, MailerConfig],
  exports: [MailService, MailerConfig],
})
export class MailModule {}
