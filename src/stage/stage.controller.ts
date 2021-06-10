import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StageService } from './stage.service';
import { StageAddDto, StagePlatformsGamesMiniGamesModesDto, StageUpdateDto } from './stage.dto';
import { Params } from '../shared/type/params';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { ApiAuth } from '../auth/api-auth.decorator';
import { StageViewModel } from './stage.view-model';
import { ScoreStatusEnum } from '../score/score-status/score-status.enum';
import { AuthUser } from '../auth/auth-user.decorator';
import { AuthPlayerPipe } from '../auth/auth-player.decorator';
import { Player } from '../player/player.entity';

@ApiAuth()
@ApiTags('Stage')
@Controller('stage')
export class StageController {
  constructor(private stageService: StageService) {}

  @ApiAdmin()
  @Post()
  async add(@Body() dto: StageAddDto): Promise<StageViewModel> {
    return this.stageService.add(dto);
  }

  @ApiAdmin()
  @Patch(`:${Params.idStage}`)
  async update(@Param(Params.idStage) idStage: number, @Body() dto: StageUpdateDto): Promise<StageViewModel> {
    return this.stageService.update(idStage, dto);
  }

  @Get(`platform/:${Params.idPlatform}/game/:${Params.idGame}/mini-game/:${Params.idMiniGame}/mode/:${Params.idMode}`)
  async findByIdPlatformGameMiniGameMode(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number,
    @Param(Params.idMode) idMode: number
  ): Promise<StageViewModel[]> {
    return this.stageService.findByIdPlatformGameMiniGameMode(idPlatform, idGame, idMiniGame, idMode);
  }

  @Get(
    `approval/admin/platform/:${Params.idPlatform}/game/:${Params.idGame}/mini-game/:${Params.idMiniGame}/mode/:${Params.idMode}`
  )
  async findApprovalAdminByIdPlatformGameMiniGameMode(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number,
    @Param(Params.idMode) idMode: number
  ): Promise<StageViewModel[]> {
    return this.stageService.findApprovalByIdPlatformGameMiniGameMode(
      ScoreStatusEnum.AwaitingApprovalAdmin,
      idPlatform,
      idGame,
      idMiniGame,
      idMode
    );
  }

  @Get(
    `approval/player/platform/:${Params.idPlatform}/game/:${Params.idGame}/mini-game/:${Params.idMiniGame}/mode/:${Params.idMode}`
  )
  async findApprovalPlayerByIdPlatformGameMiniGameMode(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number,
    @Param(Params.idMode) idMode: number,
    @AuthUser(AuthPlayerPipe) player: Player
  ): Promise<StageViewModel[]> {
    return this.stageService.findApprovalByIdPlatformGameMiniGameMode(
      ScoreStatusEnum.AwaitingApprovalPlayer,
      idPlatform,
      idGame,
      idMiniGame,
      idMode,
      player.id
    );
  }

  @Get(`platforms/games/mini-games/modes`)
  async findByIdPlatformsGamesMiniGamesModes(
    @Query() dto: StagePlatformsGamesMiniGamesModesDto
  ): Promise<StageViewModel[]> {
    return this.stageService.findByIdPlatformsGamesMiniGamesModes(dto);
  }

  @Get(`:${Params.idStage}`)
  async findById(@Param(Params.idStage) idStage: number): Promise<StageViewModel> {
    return this.stageService.findById(idStage);
  }
}
