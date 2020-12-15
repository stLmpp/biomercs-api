import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';
import { ScoreApprovalMotiveService } from './score-approval-motive.service';
import { ScoreApprovalMotive } from './score-approval-motive.entity';
import { ScoreApprovalMotiveAddDto, ScoreApprovalMotiveUpdateDto } from './score-approval-motive.dto';
import { Params } from '../../shared/type/params';
import { ScoreApprovalActionEnum } from '../score-approval/score-approval-action.enum';
import { ApiAdmin } from '../../auth/api-admin.decorator';

@ApiAuth()
@ApiTags('Score approval motive')
@Controller('score-approval-motive')
export class ScoreApprovalMotiveController {
  constructor(private scoreApprovalMotiveService: ScoreApprovalMotiveService) {}

  @ApiAdmin()
  @Post()
  async add(@Body() dto: ScoreApprovalMotiveAddDto): Promise<ScoreApprovalMotive> {
    return this.scoreApprovalMotiveService.add(dto);
  }

  @ApiAdmin()
  @Patch(`:${Params.idScoreApprovalMotive}`)
  async update(
    @Param(Params.idScoreApprovalMotive) idScoreApprovalMotive: number,
    @Body() dto: ScoreApprovalMotiveUpdateDto
  ): Promise<ScoreApprovalMotive> {
    return this.scoreApprovalMotiveService.update(idScoreApprovalMotive, dto);
  }

  @Get('action')
  async findByAction(@Query(Params.action) action: ScoreApprovalActionEnum): Promise<ScoreApprovalMotive[]> {
    return this.scoreApprovalMotiveService.findByAction(action);
  }
}
