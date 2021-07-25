import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';
import { ScoreApprovalMotiveService } from './score-approval-motive.service';
import { ScoreApprovalMotive } from './score-approval-motive.entity';
import { ScoreApprovalMotiveAddDto, ScoreApprovalMotiveUpdateDto } from './score-approval-motive.dto';
import { Params } from '../../shared/type/params';
import { ScoreApprovalActionEnum } from '../score-approval/score-approval-action.enum';
import { ApiAdmin } from '../../auth/api-admin.decorator';
import { InjectMapProfile } from '../../mapper/inject-map-profile';
import { ScoreApprovalMotiveViewModel } from './score-approval-motive.view-model';
import { MapProfile } from '../../mapper/map-profile';

@ApiAuth()
@ApiTags('Score approval motive')
@Controller('score-approval-motive')
export class ScoreApprovalMotiveController {
  constructor(
    private scoreApprovalMotiveService: ScoreApprovalMotiveService,
    @InjectMapProfile(ScoreApprovalMotive, ScoreApprovalMotiveViewModel)
    private mapProfile: MapProfile<ScoreApprovalMotive, ScoreApprovalMotiveViewModel>
  ) {}

  @ApiAdmin()
  @Post()
  async add(@Body() dto: ScoreApprovalMotiveAddDto): Promise<ScoreApprovalMotiveViewModel> {
    return this.mapProfile.mapPromise(this.scoreApprovalMotiveService.add(dto));
  }

  @ApiAdmin()
  @Patch(`:${Params.idScoreApprovalMotive}`)
  async update(
    @Param(Params.idScoreApprovalMotive) idScoreApprovalMotive: number,
    @Body() dto: ScoreApprovalMotiveUpdateDto
  ): Promise<ScoreApprovalMotiveViewModel> {
    return this.mapProfile.mapPromise(this.scoreApprovalMotiveService.update(idScoreApprovalMotive, dto));
  }

  @Get('action')
  async findByAction(@Query(Params.action) action: ScoreApprovalActionEnum): Promise<ScoreApprovalMotiveViewModel[]> {
    return this.mapProfile.mapPromise(this.scoreApprovalMotiveService.findByAction(action));
  }
}
