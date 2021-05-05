import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../auth/api-auth.decorator';
import { ScoreService } from './score.service';
import { ScoreAddDto, ScoreChangeRequestsFulfilDto, ScoreSearchDto } from './score.dto';
import { Params } from '../shared/type/params';
import { ScoreViewModel } from './view-model/score.view-model';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '../user/user.entity';
import { ScoreTopTableViewModel, ScoreTopTableWorldRecordViewModel } from './view-model/score-table.view-model';
import { OptionalQueryPipe } from '../shared/pipe/optional-query.pipe';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { ScoreApprovalViewModel } from './view-model/score-approval.view-model';
import { ScoreApprovalAddDto } from './score-approval/score-approval.dto';
import { ScoreApprovalActionEnum } from './score-approval/score-approval-action.enum';
import { ApiOrderByAndDir } from '../shared/order-by/api-order-by';
import { OrderByDirection } from 'st-utils';
import { ScoreChangeRequestsPaginationViewModel } from './view-model/score-change-request.view-model';
import { ScoreChangeRequest } from './score-change-request/score-change-request.entity';
import { ScoreStatusEnum } from './score-status.enum';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiPagination } from '../shared/decorator/api-pagination';
import { addDays } from 'date-fns';

@ApiAuth()
@ApiTags('Score')
@Controller('score')
export class ScoreController {
  constructor(private scoreService: ScoreService) {}

  @Post()
  async add(@Body() dto: ScoreAddDto, @AuthUser() user: User): Promise<ScoreViewModel> {
    return this.scoreService.add(dto, user);
  }

  @ApiQuery({ name: 'platform', required: false })
  @ApiQuery({ name: 'game', required: false })
  @ApiQuery({ name: 'miniGame', required: false })
  @ApiQuery({ name: 'mode', required: false })
  @ApiQuery({ name: 'approved', required: false })
  @ApiQuery({ name: 'characterCostume', required: false })
  @ApiQuery({ name: 'stage', required: false })
  @Post('insert-random')
  // TODO REMOVE
  async insertRandom(
    @AuthUser() user: User,
    @Query('platform') platform?: string,
    @Query('game') game?: string,
    @Query('miniGame') miniGame?: string,
    @Query('mode') mode?: string,
    @Query('approved') approved?: boolean,
    @Query('characterCostume') characterCostume?: string,
    @Query('stage') stage?: string
  ): Promise<void> {
    await this.scoreService.insert({ miniGame, platform, mode, game, approved, characterCostume, stage }, user);
  }

  @ApiQuery({ name: 'platform', required: false })
  @ApiQuery({ name: 'game', required: false })
  @ApiQuery({ name: 'miniGame', required: false })
  @ApiQuery({ name: 'mode', required: false })
  @ApiQuery({ name: 'approved', required: false })
  @ApiQuery({ name: 'characterCostume', required: false })
  @ApiQuery({ name: 'stage', required: false })
  @ApiQuery({ name: 'fromDate', required: false })
  @Post('insert-many-random')
  // TODO REMOVE
  async insertManyRandom(
    @AuthUser() user: User,
    @Query('q') q: number,
    @Query('platform') platform?: string,
    @Query('game') game?: string,
    @Query('miniGame') miniGame?: string,
    @Query('mode') mode?: string,
    @Query('approved') approved?: boolean,
    @Query('characterCostume') characterCostume?: string,
    @Query('stage') stage?: string,
    @Query('fromDate', OptionalQueryPipe) fromDate?: Date
  ): Promise<void> {
    if (fromDate) {
      fromDate = new Date(fromDate);
    }
    for (let i = 0; i < q; i++) {
      await this.scoreService.insert(
        { miniGame, platform, mode, game, approved, characterCostume, stage },
        user,
        fromDate
      );
      if (fromDate) {
        fromDate = addDays(fromDate, 1);
      }
    }
  }

  @ApiQuery({ name: Params.limit, required: false })
  @Get(
    `platform/:${Params.idPlatform}/game/:${Params.idGame}/mini-game/:${Params.idMiniGame}/mode/:${Params.idMode}/leaderboards`
  )
  async findLeaderboards(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number,
    @Param(Params.idMode) idMode: number,
    @Query(Params.page) page: number,
    @Query(Params.limit, OptionalQueryPipe) limit?: number
  ): Promise<ScoreTopTableViewModel> {
    return this.scoreService.findLeaderboards(idPlatform, idGame, idMiniGame, idMode, page, limit ?? 10);
  }

  @Get(
    `platform/:${Params.idPlatform}/game/:${Params.idGame}/mini-game/:${Params.idMiniGame}/mode/:${Params.idMode}/world-record/table`
  )
  async findWorldRecordTable(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number,
    @Param(Params.idMode) idMode: number
  ): Promise<ScoreTopTableWorldRecordViewModel> {
    return this.scoreService.findWorldRecordsTable(idPlatform, idGame, idMiniGame, idMode);
  }

  @ApiQuery({ name: Params.idPlatform, required: false })
  @ApiQuery({ name: Params.idGame, required: false })
  @ApiQuery({ name: Params.idMiniGame, required: false })
  @ApiQuery({ name: Params.idMode, required: false })
  @ApiQuery({ name: Params.limit, required: false })
  @ApiQuery({ name: Params.idStage, required: false })
  @ApiOrderByAndDir()
  @ApiAdmin()
  @Get(`approval/admin`)
  async findApprovalListAdmin(
    @Query(Params.idPlatform) idPlatform: number,
    @Query(Params.page) page: number,
    @Query(Params.idGame, OptionalQueryPipe) idGame?: number,
    @Query(Params.idMiniGame, OptionalQueryPipe) idMiniGame?: number,
    @Query(Params.idMode, OptionalQueryPipe) idMode?: number,
    @Query(Params.idStage, OptionalQueryPipe) idStage?: number,
    @Query(Params.limit, OptionalQueryPipe) limit?: number,
    @Query(Params.orderBy, OptionalQueryPipe) orderBy?: string,
    @Query(Params.orderByDirection, OptionalQueryPipe) orderByDirection?: OrderByDirection
  ): Promise<ScoreApprovalViewModel> {
    return this.scoreService.findApprovalListAdmin({
      idMiniGame,
      idMode,
      idPlatform,
      limit: limit ?? 10,
      page,
      idGame,
      orderBy: orderBy ?? 'creationDate',
      orderByDirection: orderByDirection ?? 'desc',
      idStage,
    });
  }

  @Get('approval/admin/count')
  async findApprovalAdminCount(): Promise<number> {
    return this.scoreService.findApprovalAdminCount();
  }

  @ApiQuery({ name: Params.idPlatform, required: false })
  @ApiQuery({ name: Params.idGame, required: false })
  @ApiQuery({ name: Params.idMiniGame, required: false })
  @ApiQuery({ name: Params.idMode, required: false })
  @ApiQuery({ name: Params.limit, required: false })
  @ApiQuery({ name: Params.idStage, required: false })
  @ApiOrderByAndDir()
  @Get(`approval/player`)
  async findApprovalListPlayer(
    @AuthUser() user: User,
    @Query(Params.idPlatform) idPlatform: number,
    @Query(Params.page) page: number,
    @Query(Params.idGame, OptionalQueryPipe) idGame?: number,
    @Query(Params.idMiniGame, OptionalQueryPipe) idMiniGame?: number,
    @Query(Params.idMode, OptionalQueryPipe) idMode?: number,
    @Query(Params.idStage, OptionalQueryPipe) idStage?: number,
    @Query(Params.limit, OptionalQueryPipe) limit?: number,
    @Query(Params.orderBy, OptionalQueryPipe) orderBy?: string,
    @Query(Params.orderByDirection, OptionalQueryPipe) orderByDirection?: OrderByDirection
  ): Promise<ScoreApprovalViewModel> {
    return this.scoreService.findApprovalListUser(user, {
      idMiniGame,
      idMode,
      idPlatform,
      limit: limit ?? 10,
      page,
      idGame,
      orderBy: orderBy ?? 'creationDate',
      orderByDirection: orderByDirection ?? 'desc',
      idStage,
    });
  }

  @Get('approval/player/count')
  async findApprovalPlayerCount(@AuthUser() user: User): Promise<number> {
    return this.scoreService.findApprovalPlayerCount(user);
  }

  @ApiQuery({ name: Params.limit, required: false })
  @Get('player/change-requests')
  async findScoresWithChangeRequests(
    @AuthUser() user: User,
    @Query(Params.page) page: number,
    @Query(Params.limit, OptionalQueryPipe) limit?: number
  ): Promise<ScoreChangeRequestsPaginationViewModel> {
    limit ??= 10;
    return this.scoreService.findScoresWithChangeRequests(user.id, page, limit);
  }

  @Get('player/change-requests/count')
  async findScoresWithChangeRequestsCount(@AuthUser() user: User): Promise<number> {
    return this.scoreService.findScoresWithChangeRequestsCount(user);
  }

  @ApiQuery({ name: Params.worldRecord, required: false })
  @ApiQuery({ name: Params.characterWorldRecord, required: false })
  @ApiQuery({ name: Params.combinationWorldRecord, required: false })
  @ApiQuery({ name: Params.score, required: false })
  @ApiQuery({ name: Params.idPlatforms, required: false, isArray: true, type: Number })
  @ApiQuery({ name: Params.idGames, required: false, isArray: true, type: Number })
  @ApiQuery({ name: Params.idMiniGames, required: false, isArray: true, type: Number })
  @ApiQuery({ name: Params.idModes, required: false, isArray: true, type: Number })
  @ApiQuery({ name: Params.idStages, required: false, isArray: true, type: Number })
  @ApiQuery({ name: Params.idCharacterCostumes, required: false, isArray: true, type: Number })
  @ApiQuery({ name: Params.status, enum: ScoreStatusEnum })
  @ApiPagination(ScoreViewModel)
  @Get('search')
  async searchScores(@Query() dto: ScoreSearchDto, @AuthUser() user: User): Promise<Pagination<ScoreViewModel>> {
    return this.scoreService.searchScores(dto, user.id);
  }

  @ApiAdmin()
  @Post(`:${Params.idScore}/approve/admin`)
  async approveAdmin(
    @Param(Params.idScore) idScore: number,
    @Body() dto: ScoreApprovalAddDto,
    @AuthUser() user: User
  ): Promise<void> {
    return this.scoreService.approvalAdmin(idScore, dto, user, ScoreApprovalActionEnum.Approve);
  }

  @Post(`:${Params.idScore}/approve/player`)
  async approvePlayer(
    @Param(Params.idScore) idScore: number,
    @Body() dto: ScoreApprovalAddDto,
    @AuthUser() user: User
  ): Promise<void> {
    return this.scoreService.approvalPlayer(idScore, dto, user, ScoreApprovalActionEnum.Approve);
  }

  @ApiAdmin()
  @Post(`:${Params.idScore}/reject/admin`)
  async rejectAdmin(
    @Param(Params.idScore) idScore: number,
    @Body() dto: ScoreApprovalAddDto,
    @AuthUser() user: User
  ): Promise<void> {
    return this.scoreService.approvalAdmin(idScore, dto, user, ScoreApprovalActionEnum.Reject);
  }

  @Post(`:${Params.idScore}/reject/player`)
  async rejectPlayer(
    @Param(Params.idScore) idScore: number,
    @Body() dto: ScoreApprovalAddDto,
    @AuthUser() user: User
  ): Promise<void> {
    return this.scoreService.approvalPlayer(idScore, dto, user, ScoreApprovalActionEnum.Reject);
  }

  @ApiAdmin()
  @ApiBody({ type: String, isArray: true })
  @Post(`:${Params.idScore}/request-changes`)
  async requestChanges(@Param(Params.idScore) idScore: number, @Body() dtos: string[]): Promise<ScoreChangeRequest[]> {
    return this.scoreService.requestChanges(idScore, dtos);
  }

  @Patch(`:${Params.idScore}/fulfil-change-requests`)
  async fulfilScoreChangeRequests(
    @Param(Params.idScore) idScore: number,
    @Body() dto: ScoreChangeRequestsFulfilDto
  ): Promise<boolean> {
    return this.scoreService.fulfilScoreChangeRequests(idScore, dto);
  }

  @Get(`:${Params.idScore}`)
  async findByIdMapped(@Param(Params.idScore) idScore: number): Promise<ScoreViewModel> {
    return this.scoreService.findByIdMapped(idScore);
  }
}
