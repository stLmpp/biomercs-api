import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailQueueRepository } from './mail-queue.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MailQueueRepository])],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
