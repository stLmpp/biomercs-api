import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../auth/api-auth.decorator';
import { ScoreService } from './score.service';
import { ScoreAddDto, ScoreChangeRequestsFulfilDto, ScoreSearchDto } from './score.dto';
import { Params } from '../shared/type/params';
import { ScoreViewModel } from './view-model/score.view-model';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '../user/user.entity';
import { ScoreTopTable, ScoreTopTableViewModel } from './view-model/score-table.view-model';
import { OptionalQueryPipe } from '../shared/pipe/optional-query.pipe';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { ScoreApprovalPagination, ScoreApprovalPaginationViewModel } from './view-model/score-approval.view-model';
import { ScoreApprovalAddDto } from './score-approval/score-approval.dto';
import { ScoreApprovalActionEnum } from './score-approval/score-approval-action.enum';
import { ApiOrderByAndDir } from '../shared/order-by/api-order-by';
import { OrderByDirection } from 'st-utils';
import {
  ScoreChangeRequestsPaginationViewModel,
  ScoreWithScoreChangeRequestsViewModel,
} from './view-model/score-change-request.view-model';
import { ScoreChangeRequest } from './score-change-request/score-change-request.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiPagination } from '../shared/decorator/api-pagination';
import { ScoresGroupedByStatus, ScoresGroupedByStatusViewModel } from './view-model/score-grouped-by-status.view-model';
import { ScoreStatusEnum } from './score-status/score-status.enum';
import { InjectMapProfile } from '../mapper/inject-map-profile';
import { Score } from './score.entity';
import { MapProfile } from '../mapper/map-profile';
import { ScoreChangeRequestViewModel } from './score-change-request/score-change-request.view-model';
import {
  ScoreTopTableWorldRecord,
  ScoreTopTableWorldRecordViewModel,
} from './view-model/score-table-world-record.view-model';
import { AuthPlayerPipe } from '../auth/auth-player.decorator';
import { Player } from '../player/player.entity';

@ApiAuth()
@ApiTags('Score')
@Controller('score')
export class ScoreController {
  constructor(
    private scoreService: ScoreService,
    @InjectMapProfile(Score, ScoreViewModel) private mapProfile: MapProfile<Score, ScoreViewModel>,
    @InjectMapProfile(ScoreChangeRequest, ScoreChangeRequestViewModel)
    private mapProfileScoreChangeRequest: MapProfile<ScoreChangeRequest, ScoreChangeRequestViewModel>,
    @InjectMapProfile(ScoreTopTable, ScoreTopTableViewModel)
    private mapProfileScoreTopTable: MapProfile<ScoreTopTable, ScoreTopTableViewModel>,
    @InjectMapProfile(ScoreApprovalPagination, ScoreApprovalPaginationViewModel)
    private mapProfileScoreApprovalPagination: MapProfile<ScoreApprovalPagination, ScoreApprovalPaginationViewModel>,
    @InjectMapProfile(ScoreTopTableWorldRecord, ScoreTopTableWorldRecordViewModel)
    private mapProfileScoreTopTableWorldRecord: MapProfile<ScoreTopTableWorldRecord, ScoreTopTableWorldRecordViewModel>,
    @InjectMapProfile(ScoresGroupedByStatus, ScoresGroupedByStatusViewModel)
    private mapProfileScoresGroupedByStatus: MapProfile<ScoresGroupedByStatus, ScoresGroupedByStatusViewModel>,
    @InjectMapProfile(Score, ScoreWithScoreChangeRequestsViewModel)
    private mapProfileScoreWithScoreChangeRequests: MapProfile<Score, ScoreWithScoreChangeRequestsViewModel>
  ) {}

  @Post()
  async add(@Body() dto: ScoreAddDto, @AuthUser() user: User): Promise<ScoreViewModel> {
    return this.mapProfile.mapPromise(this.scoreService.add(dto, user));
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
    return this.mapProfileScoreTopTable.mapPromise(
      this.scoreService.findLeaderboards(idPlatform, idGame, idMiniGame, idMode, page, limit ?? 10)
    );
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
    return this.mapProfileScoreTopTableWorldRecord.mapPromise(
      this.scoreService.findWorldRecordsTable(idPlatform, idGame, idMiniGame, idMode)
    );
  }

  @ApiQuery({ name: Params.idPlatform, required: false })
  @ApiQuery({ name: Params.idGame, required: false })
  @ApiQuery({ name: Params.idMiniGame, required: false })
  @ApiQuery({ name: Params.idMode, required: false })
  @ApiQuery({ name: Params.limit, required: false })
  @ApiQuery({ name: Params.idStage, required: false })
  @ApiOrderByAndDir()
  @ApiAdmin()
  @Get(`approval`)
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
  ): Promise<ScoreApprovalPaginationViewModel> {
    return this.mapProfileScoreApprovalPagination.mapPromise(
      this.scoreService.findApprovalListAdmin({
        idMiniGame,
        idMode,
        idPlatform,
        limit: limit ?? 10,
        page,
        idGame,
        orderBy: orderBy ?? 'creationDate',
        orderByDirection: orderByDirection ?? 'desc',
        idStage,
      })
    );
  }

  @Get('approval/count')
  async findApprovalAdminCount(): Promise<number> {
    return this.scoreService.findApprovalAdminCount();
  }

  @ApiQuery({ name: Params.limit, required: false })
  @Get('player/change-requests')
  async findScoresWithChangeRequests(
    @AuthUser(AuthPlayerPipe) player: Player,
    @Query(Params.page) page: number,
    @Query(Params.limit, OptionalQueryPipe) limit?: number
  ): Promise<ScoreChangeRequestsPaginationViewModel> {
    limit ??= 10;
    const { items, meta } = await this.scoreService.findScoresWithChangeRequests(player.id, page, limit);
    const viewModel = new ScoreChangeRequestsPaginationViewModel();
    viewModel.meta = meta;
    viewModel.scores = this.mapProfileScoreWithScoreChangeRequests.map(items);
    return viewModel;
  }

  @Get('player/change-requests/count')
  async findScoresWithChangeRequestsCount(@AuthUser() user: User): Promise<number> {
    return this.scoreService.findScoresWithChangeRequestsCount(user);
  }

  @Get('player/rejected-and-pending')
  async findRejectedAndPendingScoresByIdPlayer(
    @AuthUser(AuthPlayerPipe) player: Player
  ): Promise<ScoresGroupedByStatusViewModel[]> {
    return this.mapProfileScoresGroupedByStatus.mapPromise(
      this.scoreService.findRejectedAndPendingScoresByIdPlayer(player.id)
    );
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
  @ApiQuery({ name: Params.idScoreStatus, enum: ScoreStatusEnum, required: false })
  @ApiPagination(ScoreViewModel)
  @Get('search')
  async searchScores(@Query() dto: ScoreSearchDto, @AuthUser() user: User): Promise<Pagination<ScoreViewModel>> {
    const { items, meta, links } = await this.scoreService.searchScores(dto, user.id);
    return new Pagination<ScoreViewModel>(this.mapProfile.map(items), meta, links);
  }

  @ApiAdmin()
  @Post(`:${Params.idScore}/approve`)
  async approveAdmin(
    @Param(Params.idScore) idScore: number,
    @Body() dto: ScoreApprovalAddDto,
    @AuthUser() user: User
  ): Promise<void> {
    return this.scoreService.approvalAdmin(idScore, dto, user, ScoreApprovalActionEnum.Approve);
  }

  @ApiAdmin()
  @Post(`:${Params.idScore}/reject`)
  async rejectAdmin(
    @Param(Params.idScore) idScore: number,
    @Body() dto: ScoreApprovalAddDto,
    @AuthUser() user: User
  ): Promise<void> {
    return this.scoreService.approvalAdmin(idScore, dto, user, ScoreApprovalActionEnum.Reject);
  }

  @ApiAdmin()
  @ApiBody({ type: String, isArray: true })
  @Post(`:${Params.idScore}/request-changes`)
  async requestChanges(
    @Param(Params.idScore) idScore: number,
    @Body() dtos: string[]
  ): Promise<ScoreChangeRequestViewModel[]> {
    return this.mapProfileScoreChangeRequest.mapPromise(this.scoreService.requestChanges(idScore, dtos));
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
    return this.mapProfile.mapPromise(this.scoreService.findByIdWithAllRelations(idScore));
  }
}
