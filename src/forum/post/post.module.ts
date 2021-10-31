import { forwardRef, Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from './post.repository';
import { PlayerModule } from '../../player/player.module';
import { SubCategoryModeratorModule } from '../sub-category-moderator/sub-category-moderator.module';
import { PostHistoryModule } from '../post-history/post-history.module';
import { UserModule } from '../../user/user.module';
import { NotificationModule } from '../../notification/notification.module';
import { TopicPlayerSettingsModule } from '../topic-player-settings/topic-player-settings.module';
import { TopicModule } from '../topic/topic.module';
import { SubCategoryModule } from '../sub-category/sub-category.module';
import { TopicPlayerLastReadModule } from '../topic-player-last-read/topic-player-last-read.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostRepository]),
    forwardRef(() => PlayerModule),
    SubCategoryModeratorModule,
    PostHistoryModule,
    UserModule,
    forwardRef(() => NotificationModule),
    TopicPlayerSettingsModule,
    forwardRef(() => TopicModule),
    forwardRef(() => SubCategoryModule),
    TopicPlayerLastReadModule,
  ],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
