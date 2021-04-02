import { Controller } from '@nestjs/common';
import { ApiAuth } from '../../auth/api-auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiAuth()
@ApiTags('Score change request')
@Controller('score-change-request')
export class ScoreChangeRequestController {}
