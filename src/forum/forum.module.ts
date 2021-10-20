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
import { SubCategoryTransferModule } from './sub-category-transfer/sub-category-transfer.module';
import { Params } from '../shared/type/params';

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
        children: [
          {
            path: `:${Params.idSubCategory}/topic`,
            module: TopicModule,
            children: [
              {
                path: `:${Params.idTopic}/post`,
                module: PostModule,
              },
            ],
          },
        ],
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
        path: 'topic-transfer',
        module: TopicTransferModule,
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
    SubCategoryTransferModule,
  ],
})
export class ForumModule {}
