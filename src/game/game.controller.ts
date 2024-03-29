import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { GameAddDto, GamePlatformsDto, GameUpdateDto } from './game.dto';
import { Params } from '../shared/type/params';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { ApiAuth } from '../auth/api-auth.decorator';
import { GameMiniGame } from './game-mini-game/game-mini-game.entity';
import { GameMiniGameService } from './game-mini-game/game-mini-game.service';
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
    return this.mapProfile.map(await this.gameService.add(dto));
  }

  @ApiAdmin()
  @Patch(`:${Params.idGame}`)
  async update(@Param(Params.idGame) idGame: number, @Body() dto: GameUpdateDto): Promise<GameViewModel> {
    return this.mapProfile.map(await this.gameService.update(idGame, dto));
  }

  @ApiAdmin()
  @Put(`:${Params.idGame}/link/mini-game/:${Params.idMiniGame}`)
  async linkGameMiniGame(
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number
  ): Promise<GameMiniGameViewModel> {
    return this.mapProfileGameMiniGame.map(await this.gameMiniGameService.link(idGame, idMiniGame));
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
    return this.mapProfile.map(await this.gameService.findByIdPlatforms(dto));
  }

  @Get(`platform/:${Params.idPlatform}`)
  async findByIdPlatform(@Param(Params.idPlatform) idPlatform: number): Promise<GameViewModel[]> {
    return this.mapProfile.map(await this.gameService.findByIdPlatform(idPlatform));
  }

  @ApiAdmin()
  @Get(`approval/platform/:${Params.idPlatform}`)
  async findApprovalAdminByIdPlatform(@Param(Params.idPlatform) idPlatform: number): Promise<GameViewModel[]> {
    return this.mapProfile.map(
      await this.gameService.findApprovalByIdPlatform(ScoreStatusEnum.AwaitingApproval, idPlatform)
    );
  }

  @Get(`:${Params.idGame}`)
  async findById(@Param(Params.idGame) idGame: number): Promise<GameViewModel> {
    return this.mapProfile.map(await this.gameService.findById(idGame));
  }
}
