import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { Game } from './game.entity';
import { GameAddDto, GamePlatformsDto, GameUpdateDto } from './game.dto';
import { Params } from '../shared/type/params';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { ApiAuth } from '../auth/api-auth.decorator';
import { GameMiniGame } from './game-mini-game/game-mini-game.entity';
import { GameMiniGameService } from './game-mini-game/game-mini-game.service';

@ApiAuth()
@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(private gameService: GameService, private gameMiniGameService: GameMiniGameService) {}

  @ApiAdmin()
  @Post()
  async add(@Body() dto: GameAddDto): Promise<Game> {
    return this.gameService.add(dto);
  }

  @ApiAdmin()
  @Patch(`:${Params.idGame}`)
  async update(@Param(Params.idGame) idGame: number, @Body() dto: GameUpdateDto): Promise<Game> {
    return this.gameService.update(idGame, dto);
  }

  @ApiAdmin()
  @Put(`:${Params.idGame}/link/mini-game/:${Params.idMiniGame}`)
  async linkGameMiniGame(
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number
  ): Promise<GameMiniGame> {
    return this.gameMiniGameService.link(idGame, idMiniGame);
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
  async findByIdPlatforms(@Query() dto: GamePlatformsDto): Promise<Game[]> {
    return this.gameService.findByIdPlatforms(dto);
  }

  @Get(`platform/:${Params.idPlatform}`)
  async findByIdPlatform(@Param(Params.idPlatform) idPlatform: number): Promise<Game[]> {
    return this.gameService.findByIdPlatform(idPlatform);
  }

  @Get(`:${Params.idGame}`)
  async findById(@Param(Params.idGame) idGame: number): Promise<Game> {
    return this.gameService.findById(idGame);
  }
}
