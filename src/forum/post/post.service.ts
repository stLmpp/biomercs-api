import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostEntity } from './post.entity';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  async findLastPostSubCategory(idSubCategory: number, idPlayer: number): Promise<PostEntity | undefined> {
    return this.postRepository.findLastPostCategory(idSubCategory, idPlayer);
  }

  async countSubCategory(idSubCategory: number): Promise<number> {
    return this.postRepository.count({ where: { topic: { idSubCategory } }, relations: ['topic'] });
  }
}
