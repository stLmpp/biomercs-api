import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { GameAddDto, GamePlatformsDto, GameUpdateDto } from './game.dto';
import { Params } from '../shared/type/params';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { ApiAuth } from '../auth/api-auth.decorator';
import { GameMiniGame } from './game-mini-game/game-mini-game.entity';
import { GameMiniGameService } from './game-mini-game/game-mini-game.service';
import { AuthUser } from '../auth/auth-user.decorator';
import { AuthPlayerPipe } from '../auth/auth-player.decorator';
import { Player } from '../player/player.entity';
import { ScoreStatusEnum } from '../score/score-status/score-status.enum';
import { GameViewModel } from './game.view-model';
import { InjectMapProfile } from '../mapper/inject-map-profile';
import { Game } from './game.entity';
import { MapProfile } from '../mapper/map-profile';
import { GameMiniGameViewModel } from './game-mini-game/game-mini-game.view-model';

@ApiAuth()
@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(
    private gameService: GameService,
    private gameMiniGameService: GameMiniGameService,
    @InjectMapProfile(Game, GameViewModel) private mapProfile: MapProfile<Game, GameViewModel>,
    @InjectMapProfile(GameMiniGame, GameMiniGameViewModel)
    private mapProfileGameMiniGame: MapProfile<GameMiniGame, GameMiniGameViewModel>
  ) {}

  @ApiAdmin()
  @Post()
  async add(@Body() dto: GameAddDto): Promise<GameViewModel> {
    return this.mapProfile.mapPromise(this.gameService.add(dto));
  }

  @ApiAdmin()
  @Patch(`:${Params.idGame}`)
  async update(@Param(Params.idGame) idGame: number, @Body() dto: GameUpdateDto): Promise<GameViewModel> {
    return this.mapProfile.mapPromise(this.gameService.update(idGame, dto));
  }

  @ApiAdmin()
  @Put(`:${Params.idGame}/link/mini-game/:${Params.idMiniGame}`)
  async linkGameMiniGame(
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number
  ): Promise<GameMiniGameViewModel> {
    return this.mapProfileGameMiniGame.mapPromise(this.gameMiniGameService.link(idGame, idMiniGame));
  }

  @ApiAdmin()
  @Delete(`:${Params.idGame}/unlink/mini-game/:${Params.idMiniGame}`)
  async unlinkGameMiniGame(
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number
  ): Promise<void> {
    await this.gameMiniGameService.unlink(idGame, idMiniGame);
  }

  @Get('platforms')
  async findByIdPlatforms(@Query() dto: GamePlatformsDto): Promise<GameViewModel[]> {
    return this.mapProfile.mapPromise(this.gameService.findByIdPlatforms(dto));
  }

  @Get(`platform/:${Params.idPlatform}`)
  async findByIdPlatform(@Param(Params.idPlatform) idPlatform: number): Promise<GameViewModel[]> {
    return this.mapProfile.mapPromise(this.gameService.findByIdPlatform(idPlatform));
  }

  @ApiAdmin()
  @Get(`approval/admin/platform/:${Params.idPlatform}`)
  async findApprovalAdminByIdPlatform(@Param(Params.idPlatform) idPlatform: number): Promise<GameViewModel[]> {
    return this.mapProfile.mapPromise(
      this.gameService.findApprovalByIdPlatform(ScoreStatusEnum.AwaitingApprovalAdmin, idPlatform)
    );
  }

  @Get(`approval/player/platform/:${Params.idPlatform}`)
  async findApprovalUserByIdPlatform(
    @Param(Params.idPlatform) idPlatform: number,
    @AuthUser(AuthPlayerPipe) player: Player
  ): Promise<GameViewModel[]> {
    return this.mapProfile.mapPromise(
      this.gameService.findApprovalByIdPlatform(ScoreStatusEnum.AwaitingApprovalPlayer, idPlatform, player.id)
    );
  }

  @Get(`:${Params.idGame}`)
  async findById(@Param(Params.idGame) idGame: number): Promise<GameViewModel> {
    return this.mapProfile.mapPromise(this.gameService.findById(idGame));
  }
}
