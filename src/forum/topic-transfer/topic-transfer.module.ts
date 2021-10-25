import { Module } from '@nestjs/common';
import { TopicTransferService } from './topic-transfer.service';
import { TopicTransferController } from './topic-transfer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicTransferRepository } from './topic-transfer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TopicTransferRepository])],
  providers: [TopicTransferService],
  controllers: [TopicTransferController],
  exports: [TopicTransferService],
})
export class TopicTransferModule {}
