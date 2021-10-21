import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicRepository } from './topic.repository';
import { PostModule } from '../post/post.module';
import { MapperModule } from '../../mapper/mapper.module';
import { EnvironmentModule } from '../../environment/environment.module';
import { PlayerModule } from '../../player/player.module';
import { SubCategoryModeratorModule } from '../sub-category-moderator/sub-category-moderator.module';
import { UserModule } from '../../user/user.module';
import { TopicPlayerLastReadModule } from '../topic-player-last-read/topic-player-last-read.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TopicRepository]),
    PostModule,
    MapperModule,
    EnvironmentModule,
    PlayerModule,
    SubCategoryModeratorModule,
    UserModule,
    TopicPlayerLastReadModule,
  ],
  providers: [TopicService],
  controllers: [TopicController],
  exports: [TopicService],
})
export class TopicModule {}
