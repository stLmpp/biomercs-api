import { ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostViewModel, PostViewModelPagination } from './post.view-model';
import { PostAddDto, PostUpdateDto } from './post.dto';
import { SubCategoryModeratorService } from '../sub-category-moderator/sub-category-moderator.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { PostHistoryService } from '../post-history/post-history.service';
import { UserService } from '../../user/user.service';
import { NotificationService } from '../../notification/notification.service';
import { TopicPlayerSettingsService } from '../topic-player-settings/topic-player-settings.service';
import { TopicService } from '../topic/topic.service';
import { NotificationAddDto } from '../../notification/notification.dto';
import { NotificationTypeEnum } from '../../notification/notification-type/notification-type.enum';
import { SubCategoryService } from '../sub-category/sub-category.service';

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    private subCategoryModeratorService: SubCategoryModeratorService,
    private postHistoryService: PostHistoryService,
    private userService: UserService,
    @Inject(forwardRef(() => NotificationService)) private notificationService: NotificationService,
    private topicPlayerSettingsService: TopicPlayerSettingsService,
    @Inject(forwardRef(() => TopicService)) private topicService: TopicService,
    @Inject(forwardRef(() => SubCategoryService)) private subCategoryService: SubCategoryService
  ) {}

  private async _validateModeratorOrCreator(
    idSubCategory: number,
    idPost: number,
    idPlayer: number,
    messageIfError: string
  ): Promise<void> {
    const isModerator = await this.subCategoryModeratorService.isModerator(idSubCategory, idPlayer);
    if (isModerator) {
      return;
    }
    const isCreator = await this.postRepository.exists({ id: idPost, idPlayer });
    if (isCreator) {
      return;
    }
    const isAdmin = await this.userService.isAdminByPlayer(idPlayer);
    if (isAdmin) {
      return;
    }
    throw new ForbiddenException(messageIfError);
  }

  private async _sendNotification(
    idSubCategory: number,
    idTopic: number,
    idPost: number,
    idPlayer: number
  ): Promise<void> {
    const topicPlayersSettings = await this.topicPlayerSettingsService.findByIdTopicWithPlayer(idTopic, idPlayer);
    if (!topicPlayersSettings.length) {
      return;
    }
    const [pageInfo, idCategory] = await Promise.all([
      this.topicService.findPageTopicPost(idSubCategory, idTopic, idPost, idPlayer),
      this.subCategoryService.findIdCategoryByIdSubCategory(idSubCategory),
    ]);
    const dtos: NotificationAddDto[] = topicPlayersSettings.map(topicPlayerSettings => ({
      idNotificationType: NotificationTypeEnum.TopicReply,
      idUser: topicPlayerSettings.player!.idUser!,
      extra: {
        idTopic,
        idPost,
        idSubCategory,
        pageSubCategory: pageInfo.pageTopic,
        pageTopic: pageInfo.pagePost,
        idCategory,
      },
    }));
    await this.notificationService.addAndSendMany(dtos);
  }

  @Transactional()
  async update(
    idSubCategory: number,
    idTopic: number,
    idPost: number,
    idPlayer: number,
    dto: PostUpdateDto
  ): Promise<void> {
    await this._validateModeratorOrCreator(idSubCategory, idPost, idPlayer, `You can only edit posts you own`);
    const post = await this.postRepository.findOneOrFail(idPost);
    await this.postHistoryService.add(post);
    await this.postRepository.update(idPost, dto);
  }

  @Transactional()
  async add(idSubCategory: number, dto: PostAddDto, idPlayer: number): Promise<PostViewModel> {
    const post = await this.postRepository.save({ ...dto, idPlayer });
    const [postViewModel, isAdmin] = await Promise.all([
      this.postRepository.findById(post.idTopic, post.id, idPlayer),
      this.userService.isAdminByPlayer(idPlayer),
      this.topicPlayerSettingsService.addIfNotSet(post.idTopic, idPlayer, true),
    ]);
    await this._sendNotification(idSubCategory, post.idTopic, post.id, idPlayer);
    postViewModel.deleteAllowed = postViewModel.deleteAllowed || isAdmin;
    postViewModel.editAllowed = postViewModel.editAllowed || isAdmin;
    return postViewModel;
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

  async findPageById(idTopic: number, idPost: number, idPlayer: number): Promise<number> {
    return this.postRepository.findPageById(idTopic, idPost, idPlayer);
  }
}
