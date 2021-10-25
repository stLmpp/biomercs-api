import { Injectable } from '@nestjs/common';
import { PostEntity } from '../post/post.entity';
import { PostHistoryRepository } from './post-history.repository';

@Injectable()
export class PostHistoryService {
  constructor(private postHistoryRepository: PostHistoryRepository) {}

  async add({ creationDate, createdBy, lastUpdatedDate, lastUpdatedBy, id, ...post }: PostEntity): Promise<void> {
    await this.postHistoryRepository.save({ ...post, idPost: id });
  }
}
