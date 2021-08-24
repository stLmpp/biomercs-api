import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicRepository } from './topic.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TopicRepository])],
  providers: [TopicService],
  controllers: [TopicController],
  exports: [TopicService],
})
export class TopicModule {}
