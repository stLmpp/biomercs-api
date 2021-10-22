import { ForbiddenException, Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostViewModel, PostViewModelPagination } from './post.view-model';
import { PostAddDto, PostUpdateDto } from './post.dto';
import { SubCategoryModeratorService } from '../sub-category-moderator/sub-category-moderator.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { PostHistoryService } from '../post-history/post-history.service';

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    private subCategoryModeratorService: SubCategoryModeratorService,
    private postHistoryService: PostHistoryService
  ) {}

  private async _validateModeratorOrCreator(
    idSubCategory: number,
    idPost: number,
    idPlayer: number,
    messageIfError: string
  ): Promise<void> {
    const isModerator = await this.subCategoryModeratorService.isModerator(idSubCategory, idPlayer);
    if (!isModerator) {
      const isCreator = await this.postRepository.exists({ id: idPost, idPlayer });
      if (!isCreator) {
        throw new ForbiddenException(messageIfError);
      }
    }
  }

  @Transactional()
  async update(
    idSubCategory: number,
    idTopic: number,
    idPost: number,
    idPlayer: number,
    dto: PostUpdateDto
  ): Promise<PostViewModel> {
    await this._validateModeratorOrCreator(idSubCategory, idPost, idPlayer, `You can only edit posts you own`);
    const post = await this.postRepository.findOneOrFail(idPost);
    await this.postHistoryService.add(post);
    await this.postRepository.update(idPost, dto);
    return this.postRepository.findById(idTopic, idPost, idPlayer);
  }

  async findByTopicPaginated(
    idTopic: number,
    idPlayer: number,
    page: number,
    limit: number
  ): Promise<PostViewModelPagination> {
    return this.postRepository.findByTopicPaginated(idTopic, idPlayer, page, limit);
  }

  async delete(idSubCategory: number, idPost: number, idPlayer: number): Promise<void> {
    await this._validateModeratorOrCreator(idSubCategory, idPost, idPlayer, `You can only delete posts you own`);
    await this.postRepository.softDelete(idPost);
  }

  async add(dto: PostAddDto, idPlayer: number): Promise<PostViewModel> {
    const post = await this.postRepository.save({ ...dto, idPlayer });
    return this.postRepository.findById(post.idTopic, post.id, idPlayer);
  }

  async findPageById(idTopic: number, idPost: number, idPlayer: number): Promise<number> {
    return this.postRepository.findPageById(idTopic, idPost, idPlayer);
  }
}
