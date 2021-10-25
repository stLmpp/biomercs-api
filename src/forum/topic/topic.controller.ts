import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';
import { Params } from '../../shared/type/params';
import { TopicService } from './topic.service';
import { TopicAddViewModel, TopicPostPageViewModel, TopicWithPostsViewModel } from './topic.view-model';
import { AuthUser } from '../../auth/auth-user.decorator';
import { AuthPlayerPipe } from '../../auth/auth-player.decorator';
import { Player } from '../../player/player.entity';
import { ApiModerator } from '../sub-category-moderator/api-moderator';
import { TopicAddDto } from './topic.dto';
import { TopicPlayerLastReadService } from '../topic-player-last-read/topic-player-last-read.service';

@ApiAuth()
@ApiTags('Topic')
@Controller()
export class TopicController {
  constructor(private topicService: TopicService, private topicPlayerLastReadService: TopicPlayerLastReadService) {}

  @Post()
  async add(
    @AuthUser(AuthPlayerPipe) player: Player,
    @Param(Params.idSubCategory) idSubCategory: number,
    @Body() dto: TopicAddDto
  ): Promise<TopicAddViewModel> {
    return this.topicService.add(idSubCategory, dto, player.id);
  }

  @Get(`:${Params.idTopic}/with/posts`)
  async findByIdWithPosts(
    @Param(Params.idTopic) idTopic: number,
    @AuthUser(AuthPlayerPipe) player: Player,
    @Query(Params.page) page: number,
    @Query(Params.limit) limit: number
  ): Promise<TopicWithPostsViewModel> {
    return this.topicService.findByIdWithPostsPaginated(idTopic, player.id, page, limit);
  }

  @Get(`:${Params.idTopic}/page/with/post/:${Params.idPost}`)
  async findPageTopicPost(
    @AuthUser(AuthPlayerPipe) player: Player,
    @Param(Params.idSubCategory) idSubCategory: number,
    @Param(Params.idTopic) idTopic: number,
    @Param(Params.idPost) idPost: number
  ): Promise<TopicPostPageViewModel> {
    return this.topicService.findPageTopicPost(idSubCategory, idTopic, idPost, player.id);
  }

  @Put(`:${Params.idTopic}/increase-views`)
  increaseViews(@Param(Params.idTopic) idTopic: number): void {
    this.topicService.increaseView(idTopic);
  }

  @ApiModerator()
  @Put(`:${Params.idTopic}/lock`)
  async lock(@Param(Params.idTopic) idTopic: number): Promise<void> {
    return this.topicService.lock(idTopic);
  }

  @ApiModerator()
  @Put(`:${Params.idTopic}/unlock`)
  async unlock(@Param(Params.idTopic) idTopic: number): Promise<void> {
    return this.topicService.unlock(idTopic);
  }

  @ApiModerator()
  @Put(`:${Params.idTopic}/pin`)
  async pin(@Param(Params.idTopic) idTopic: number): Promise<void> {
    return this.topicService.pin(idTopic);
  }

  @ApiModerator()
  @Put(`:${Params.idTopic}/unpin`)
  async unpin(@Param(Params.idTopic) idTopic: number): Promise<void> {
    return this.topicService.unpin(idTopic);
  }

  @Put(`:${Params.idTopic}/read`)
  async read(@AuthUser(AuthPlayerPipe) player: Player, @Param(Params.idTopic) idTopic: number): Promise<void> {
    return this.topicPlayerLastReadService.upsert(player.id, idTopic);
  }

  @ApiModerator()
  @Put(`:${Params.idTopic}/move/:${Params.idSubCategoryTo}`)
  async move(
    @Param(Params.idSubCategory) idSubCategory: number,
    @Param(Params.idTopic) idTopic: number,
    @Param(Params.idSubCategoryTo) idSubCategoryTo: number
  ): Promise<void> {
    return this.topicService.move(idSubCategory, idTopic, idSubCategoryTo);
  }

  @Delete(`:${Params.idTopic}`)
  async delete(
    @AuthUser(AuthPlayerPipe) player: Player,
    @Param(Params.idSubCategory) idSubCategory: number,
    @Param(Params.idTopic) idTopic: number
  ): Promise<void> {
    return this.topicService.delete(idSubCategory, idTopic, player.id);
  }
}
