import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostViewModelPagination } from './post.view-model';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  async findByTopicPaginated(
    idTopic: number,
    idPlayer: number,
    page: number,
    limit: number
  ): Promise<PostViewModelPagination> {
    return this.postRepository.findByTopicPaginated(idTopic, idPlayer, page, limit);
  }
}
