import { Module } from '@nestjs/common';
import { TopicPlayerLastReadService } from './topic-player-last-read.service';
import { TopicPlayerLastReadController } from './topic-player-last-read.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicPlayerLastReadRepository } from './topic-player-last-read.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TopicPlayerLastReadRepository])],
  providers: [TopicPlayerLastReadService],
  controllers: [TopicPlayerLastReadController],
})
export class TopicPlayerLastReadModule {}
