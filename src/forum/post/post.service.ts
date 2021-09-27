import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostEntity } from './post.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  async findByTopicPaginated(idTopic: number, page: number, limit: number): Promise<Pagination<PostEntity>> {
    return this.postRepository.paginate({ page, limit }, { where: { idTopic }, order: { id: 'ASC' } });
  }
}
