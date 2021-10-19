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

  @Delete(`:${Params.idTopic}`)
  async delete(@Param(Params.idTopic) idTopic: number): Promise<void> {
    return this.topicService.delete(idTopic);
  }
}
