import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';
import { PostService } from './post.service';
import { Params } from '../../shared/type/params';
import { PostViewModel } from './post.view-model';
import { AuthUser } from '../../auth/auth-user.decorator';
import { AuthPlayerPipe } from '../../auth/auth-player.decorator';
import { Player } from '../../player/player.entity';
import { PostUpdateDto } from './post.dto';

@ApiAuth()
@ApiTags('Post')
@Controller()
export class PostController {
  constructor(private postService: PostService) {}

  @Patch(`:${Params.idPost}`)
  async update(
    @AuthUser(AuthPlayerPipe) player: Player,
    @Param(Params.idTopic) idTopic: number,
    @Param(Params.idPost) idPost: number,
    @Body() dto: PostUpdateDto
  ): Promise<PostViewModel> {
    return this.postService.update(idTopic, idPost, player.id, dto);
  }

  @Delete(`:${Params.idPost}`)
  async delete(@Param(Params.idPost) idPost: number): Promise<void> {
    await this.postService.delete(idPost);
  }
}
