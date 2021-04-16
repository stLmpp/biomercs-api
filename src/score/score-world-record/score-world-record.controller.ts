import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';

@ApiAuth()
@ApiTags('Score world record')
@Controller('score-world-record')
export class ScoreWorldRecordController {}
