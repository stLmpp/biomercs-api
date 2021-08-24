import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategoryRepository } from './sub-category.repository';
import { SubCategoryTransferModule } from '../sub-category-transfer/sub-category-transfer.module';
import { PostModule } from '../post/post.module';
import { TopicModule } from '../topic/topic.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategoryRepository]), SubCategoryTransferModule, PostModule, TopicModule],
  providers: [SubCategoryService],
  controllers: [SubCategoryController],
  exports: [SubCategoryService],
})
export class SubCategoryModule {}
