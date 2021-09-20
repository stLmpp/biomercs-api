import { Controller, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';
import { Params } from '../../shared/type/params';
import { TopicService } from './topic.service';

@ApiAuth()
@ApiTags('Topic')
@Controller()
export class TopicController {
  constructor(private topicService: TopicService) {}

  @Put(`:${Params.idTopic}/increase-views`)
  increaseViews(@Param(Params.idTopic) idTopic: number): void {
    this.topicService.increaseView(idTopic);
  }
}
