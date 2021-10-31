import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';

@ApiAuth()
@ApiTags('Topic Player Last Read')
@Controller()
export class TopicPlayerLastReadController {}
