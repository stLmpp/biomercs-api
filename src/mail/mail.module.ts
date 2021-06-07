import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailQueueRepository } from './mail-queue.repository';
import { MailController } from './mail.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MailQueueRepository])],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
