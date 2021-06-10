import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ModeService } from './mode.service';
import { Mode } from './mode.entity';
import { ModeAddDto, ModePlatformsGamesMiniGamesDto, ModeUpdateDto } from './mode.dto';
import { Params } from '../shared/type/params';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { ApiAuth } from '../auth/api-auth.decorator';
import { ScoreStatusEnum } from '../score/score-status/score-status.enum';
import { AuthUser } from '../auth/auth-user.decorator';
import { AuthPlayerPipe } from '../auth/auth-player.decorator';
import { Player } from '../player/player.entity';

@ApiAuth()
@ApiTags('Mode')
@Controller('mode')
export class ModeController {
  constructor(private modeService: ModeService) {}

  @ApiAdmin()
  @Post()
  async add(@Body() dto: ModeAddDto): Promise<Mode> {
    return this.modeService.add(dto);
  }

  @ApiAdmin()
  @Patch(`:${Params.idMode}`)
  async update(@Param(Params.idMode) idMode: number, @Body() dto: ModeUpdateDto): Promise<Mode> {
    return this.modeService.update(idMode, dto);
  }

  @Get(`platform/:${Params.idPlatform}/game/:${Params.idGame}/mini-game/:${Params.idMiniGame}`)
  async findByIdPlatformGameMiniGame(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number
  ): Promise<Mode[]> {
    return this.modeService.findByIdPlatformGameMiniGame(idPlatform, idGame, idMiniGame);
  }

  @ApiAdmin()
  @Get(`approval/admin/platform/:${Params.idPlatform}/game/:${Params.idGame}/mini-game/:${Params.idMiniGame}`)
  async findApprovalAdminByIdPlatformGameMiniGame(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number
  ): Promise<Mode[]> {
    return this.modeService.findApprovalByIdPlatformGameMiniGame(
      ScoreStatusEnum.AwaitingApprovalAdmin,
      idPlatform,
      idGame,
      idMiniGame
    );
  }

  @Get(`approval/player/platform/:${Params.idPlatform}/game/:${Params.idGame}/mini-game/:${Params.idMiniGame}`)
  async findApprovalPlayerByIdPlatformGameMiniGame(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number,
    @AuthUser(AuthPlayerPipe) player: Player
  ): Promise<Mode[]> {
    return this.modeService.findApprovalByIdPlatformGameMiniGame(
      ScoreStatusEnum.AwaitingApprovalPlayer,
      idPlatform,
      idGame,
      idMiniGame,
      player.id
    );
  }

  @Get(`platforms/games/mini-games`)
  async findByIdPlatformsGamesMiniGames(@Query() dto: ModePlatformsGamesMiniGamesDto): Promise<Mode[]> {
    return this.modeService.findByIdPlatformsGamesMiniGames(dto);
  }

  @Get(`:${Params.idMode}`)
  async findById(@Param(Params.idMode) idMode: number): Promise<Mode> {
    return this.modeService.findById(idMode);
  }
}
