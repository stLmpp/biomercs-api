import { Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';
import { Params } from '../../shared/type/params';
import { TopicService } from './topic.service';
import { TopicWithPostsViewModel } from './topic.view-model';
import { AuthUser } from '../../auth/auth-user.decorator';
import { AuthPlayerPipe } from '../../auth/auth-player.decorator';
import { Player } from '../../player/player.entity';

@ApiAuth()
@ApiTags('Topic')
@Controller()
export class TopicController {
  constructor(private topicService: TopicService) {}

  @Get(`:${Params.idTopic}/with/posts`)
  async findByIdWithPosts(
    @Param(Params.idTopic) idTopic: number,
    @AuthUser(AuthPlayerPipe) player: Player,
    @Query(Params.page) page: number,
    @Query(Params.limit) limit: number
  ): Promise<TopicWithPostsViewModel> {
    return this.topicService.findByIdWithPostsPaginated(idTopic, player.id, page, limit);
  }

  @Put(`:${Params.idTopic}/increase-views`)
  increaseViews(@Param(Params.idTopic) idTopic: number): void {
    this.topicService.increaseView(idTopic);
  }

  // TODO validate moderator (#56)
  @Put(`:${Params.idTopic}/lock`)
  async lock(@Param(Params.idTopic) idTopic: number): Promise<void> {
    return this.topicService.lock(idTopic);
  }

  // TODO validate moderator (#56)
  @Put(`:${Params.idTopic}/unlock`)
  async unlock(@Param(Params.idTopic) idTopic: number): Promise<void> {
    return this.topicService.unlock(idTopic);
  }

  // TODO validate moderator (#56)
  @Put(`:${Params.idTopic}/pin`)
  async pin(@Param(Params.idTopic) idTopic: number): Promise<void> {
    return this.topicService.pin(idTopic);
  }

  // TODO validate moderator (#56)
  @Put(`:${Params.idTopic}/unpin`)
  async unpin(@Param(Params.idTopic) idTopic: number): Promise<void> {
    return this.topicService.unpin(idTopic);
  }

  // TODO validate same user or moderator (#56)
  @Delete(`:${Params.idTopic}`)
  async delete(@Param(Params.idTopic) idTopic: number): Promise<void> {
    return this.topicService.delete(idTopic);
  }
}
