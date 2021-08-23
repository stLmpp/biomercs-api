import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { ModeratorModule } from './moderator/moderator.module';
import { SubCategoryModeratorModule } from './sub-category-moderator/sub-category-moderator.module';

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
  ],
})
export class ForumModule {}
