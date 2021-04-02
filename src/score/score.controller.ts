import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../auth/api-auth.decorator';
import { ScoreService } from './score.service';
import { ScoreAddDto } from './score.dto';
import { Params } from '../shared/type/params';
import { ScoreViewModel } from './view-model/score.view-model';
import { Score } from './score.entity';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '../user/user.entity';
import { ScoreTopTableViewModel } from './view-model/score-table.view-model';
import { OptionalQueryPipe } from '../shared/pipe/optional-query.pipe';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { ScoreApprovalViewModel } from './view-model/score-approval.view-model';
import { ScoreApprovalAddDto } from './score-approval/score-approval.dto';
import { ScoreApprovalActionEnum } from './score-approval/score-approval-action.enum';
import { ApiOrderByAndDir } from '../shared/order-by/api-order-by';
import { OrderByDirection } from 'st-utils';
import { ScoreChangeRequestsPaginationViewModel } from './view-model/score-change-request.view-model';
import { ScoreChangeRequest } from './score-change-request/score-change-request.entity';
import { ScoreChangeRequestService } from './score-change-request/score-change-request.service';

@ApiAuth()
@ApiTags('Score')
@Controller('score')
export class ScoreController {
  constructor(private scoreService: ScoreService, private scoreChangeRequestService: ScoreChangeRequestService) {}

  @Post()
  async add(@Body() dto: ScoreAddDto, @AuthUser() user: User): Promise<ScoreViewModel> {
    return this.scoreService.add(dto, user);
  }

  @ApiQuery({ name: 'platform', required: false })
  @ApiQuery({ name: 'game', required: false })
  @ApiQuery({ name: 'miniGame', required: false })
  @ApiQuery({ name: 'mode', required: false })
  @Post('insert-random')
  async insertRandom(
    @Query('platform') platform?: string,
    @Query('game') game?: string,
    @Query('miniGame') miniGame?: string,
    @Query('mode') mode?: string
  ): Promise<Score> {
    return this.scoreService.insert({ miniGame, platform, mode, game });
  }

  @ApiQuery({ name: 'platform', required: false })
  @ApiQuery({ name: 'game', required: false })
  @ApiQuery({ name: 'miniGame', required: false })
  @ApiQuery({ name: 'mode', required: false })
  @Post('insert-many-random')
  async insertManyRandom(
    @Query('q') q: number,
    @Query('platform') platform?: string,
    @Query('game') game?: string,
    @Query('miniGame') miniGame?: string,
    @Query('mode') mode?: string
  ): Promise<Score[]> {
    return Promise.all(
      Array.from({ length: q }).map(() => this.scoreService.insert({ miniGame, platform, mode, game }))
    );
  }

  @ApiQuery({ name: Params.limit, required: false })
  @Get(
    `platform/:${Params.idPlatform}/game/:${Params.idGame}/mini-game/:${Params.idMiniGame}/mode/:${Params.idMode}/score-table`
  )
  async findScoreTable(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number,
    @Param(Params.idMode) idMode: number,
    @Query(Params.page) page: number,
    @Query(Params.limit, OptionalQueryPipe) limit?: number
  ): Promise<ScoreTopTableViewModel> {
    return this.scoreService.findScoreTable(idPlatform, idGame, idMiniGame, idMode, page, limit ?? 10);
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
  async addMany(@Param(Params.idScore) idScore: number, @Body() dtos: string[]): Promise<ScoreChangeRequest[]> {
    return this.scoreChangeRequestService.addMany(idScore, dtos);
  }

  @Get(`:${Params.idScore}`)
  async findByIdMapped(@Param(Params.idScore) idScore: number): Promise<ScoreViewModel> {
    return this.scoreService.findByIdMapped(idScore);
  }
}
