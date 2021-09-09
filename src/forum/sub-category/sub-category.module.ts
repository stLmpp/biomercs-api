import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategoryRepository } from './sub-category.repository';
import { SubCategoryTransferModule } from '../sub-category-transfer/sub-category-transfer.module';
import { PostModule } from '../post/post.module';
import { TopicModule } from '../topic/topic.module';
import { SubCategoryModeratorModule } from '../sub-category-moderator/sub-category-moderator.module';
import { EnvironmentModule } from '../../environment/environment.module';
import { MapperModule } from '../../mapper/mapper.module';
import { ModeratorModule } from '../moderator/moderator.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubCategoryRepository]),
    SubCategoryTransferModule,
    PostModule,
    TopicModule,
    SubCategoryModeratorModule,
    EnvironmentModule,
    MapperModule,
    ModeratorModule,
  ],
  providers: [SubCategoryService],
  controllers: [SubCategoryController],
  exports: [SubCategoryService],
})
export class SubCategoryModule {}
