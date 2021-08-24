import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from './post.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository])],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
