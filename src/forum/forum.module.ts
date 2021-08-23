import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { ModeratorModule } from './moderator/moderator.module';
import { SubCategoryModeratorModule } from './sub-category-moderator/sub-category-moderator.module';
import { TopicModule } from './topic/topic.module';
import { TopicTransferModule } from './topic-transfer/topic-transfer.module';
import { PostModule } from './post/post.module';
import { TopicPlayerLastReadModule } from './topic-player-last-read/topic-player-last-read.module';

const routes: Routes = [
  {
    path: 'forum',
    children: [
      {
        path: 'category',
        module: CategoryModule,
      },
      {
        path: 'sub-category',
        module: SubCategoryModule,
      },
      {
        path: 'moderator',
        module: ModeratorModule,
      },
      {
        path: 'sub-category-moderator',
        module: SubCategoryModeratorModule,
      },
      {
        path: 'topic',
        module: TopicModule,
      },
      {
        path: 'topic-transfer',
        module: TopicTransferModule,
      },
      {
        path: 'post',
        module: PostModule,
      },
      {
        path: 'topic-player-last-read',
        module: TopicPlayerLastReadModule,
      },
    ],
  },
];

@Module({
  imports: [
    RouterModule.register(routes),
    CategoryModule,
    SubCategoryModule,
    ModeratorModule,
    SubCategoryModeratorModule,
    TopicModule,
    TopicTransferModule,
    PostModule,
    TopicPlayerLastReadModule,
  ],
})
export class ForumModule {}
