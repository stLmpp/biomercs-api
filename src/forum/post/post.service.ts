import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostViewModel, PostViewModelPagination } from './post.view-model';
import { PostUpdateDto } from './post.dto';
import { getMentionIdsAsSetFromPostContent } from './util';

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

  async update(idTopic: number, idPost: number, idPlayer: number, dto: PostUpdateDto): Promise<PostViewModel> {
    if (dto.content) {
      const post = await this.postRepository.findOneOrFail(idPost);
      const mentions = post.getMentionIdsAsSet();
      const newMentions = getMentionIdsAsSetFromPostContent(dto.content);
      for (const newMention of newMentions) {
        if (!mentions.has(newMention)) {
          // TODO do something here to send notifications
        }
      }
    }

    await this.postRepository.update(idPost, dto);
    return this.postRepository.findById(idTopic, idPost, idPlayer);
  }
}
