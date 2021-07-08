import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MiniGameService } from './mini-game.service';
import { MiniGameAddDto, MiniGamePlatformsGamesDto, MiniGameUpdateDto } from './mini-game.dto';
import { Params } from '../shared/type/params';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { ApiAuth } from '../auth/api-auth.decorator';
import { ScoreStatusEnum } from '../score/score-status/score-status.enum';
import { AuthUser } from '../auth/auth-user.decorator';
import { AuthPlayerPipe } from '../auth/auth-player.decorator';
import { Player } from '../player/player.entity';
import { MiniGameViewModel } from './mini-game.view-model';

@ApiAuth()
@ApiTags('Mini game')
@Controller('mini-game')
export class MiniGameController {
  constructor(private miniGameService: MiniGameService) {}

  @ApiAdmin()
  @Post()
  async add(@Body() dto: MiniGameAddDto): Promise<MiniGameViewModel> {
    return this.miniGameService.add(dto);
  }

  @ApiAdmin()
  @Patch(`:${Params.idMiniGame}`)
  async update(
    @Param(Params.idMiniGame) idMiniGame: number,
    @Body() dto: MiniGameUpdateDto
  ): Promise<MiniGameViewModel> {
    return this.miniGameService.update(idMiniGame, dto);
  }

  @Get(`platform/:${Params.idPlatform}/game/:${Params.idGame}`)
  async findByIdPlatformGame(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number
  ): Promise<MiniGameViewModel[]> {
    return this.miniGameService.findByIdPlatformGame(idPlatform, idGame);
  }

  @Get(`platforms/games`)
  async findByIdPlatformsGames(@Query() dto: MiniGamePlatformsGamesDto): Promise<MiniGameViewModel[]> {
    return this.miniGameService.findByIdPlatformsGames(dto);
  }

  @ApiAdmin()
  @Get(`approval/admin/platform/:${Params.idPlatform}/game/:${Params.idGame}`)
  async findApprovalAdminByIdPlatformGame(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number
  ): Promise<MiniGameViewModel[]> {
    return this.miniGameService.findApprovalByIdPlatformGame(ScoreStatusEnum.AwaitingApprovalAdmin, idPlatform, idGame);
  }

  @Get(`approval/player/platform/:${Params.idPlatform}/game/:${Params.idGame}`)
  async findApprovalUserByIdPlatformGame(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @AuthUser(AuthPlayerPipe) player: Player
  ): Promise<MiniGameViewModel[]> {
    return this.miniGameService.findApprovalByIdPlatformGame(
      ScoreStatusEnum.AwaitingApprovalPlayer,
      idPlatform,
      idGame,
      player.id
    );
  }

  @Get(`:${Params.idMiniGame}`)
  async findById(@Param(Params.idMiniGame) idMiniGame: number): Promise<MiniGameViewModel> {
    return this.miniGameService.findById(idMiniGame);
  }
}
