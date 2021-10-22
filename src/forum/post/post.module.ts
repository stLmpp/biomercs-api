import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from './post.repository';
import { PlayerModule } from '../../player/player.module';
import { SubCategoryModeratorModule } from '../sub-category-moderator/sub-category-moderator.module';
import { PostHistoryModule } from '../post-history/post-history.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository]), PlayerModule, SubCategoryModeratorModule, PostHistoryModule],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
