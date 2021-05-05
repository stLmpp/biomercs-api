import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MiniGameService } from './mini-game.service';
import { MiniGame } from './mini-game.entity';
import { MiniGameAddDto, MiniGamePlatformsGamesDto, MiniGameUpdateDto } from './mini-game.dto';
import { Params } from '../shared/type/params';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { ApiAuth } from '../auth/api-auth.decorator';

@ApiAuth()
@ApiTags('Mini game')
@Controller('mini-game')
export class MiniGameController {
  constructor(private miniGameService: MiniGameService) {}

  @ApiAdmin()
  @Post()
  async add(@Body() dto: MiniGameAddDto): Promise<MiniGame> {
    return this.miniGameService.add(dto);
  }

  @ApiAdmin()
  @Patch(`:${Params.idMiniGame}`)
  async update(@Param(Params.idMiniGame) idMiniGame: number, @Body() dto: MiniGameUpdateDto): Promise<MiniGame> {
    return this.miniGameService.update(idMiniGame, dto);
  }

  @Get(`platform/:${Params.idPlatform}/game/:${Params.idGame}`)
  async findByIdPlatformGame(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number
  ): Promise<MiniGame[]> {
    return this.miniGameService.findByIdPlatformGame(idPlatform, idGame);
  }

  @Get(`platforms/games`)
  async findByIdPlatformsGames(@Query() dto: MiniGamePlatformsGamesDto): Promise<MiniGame[]> {
    return this.miniGameService.findByIdPlatformsGames(dto);
  }

  @Get(`:${Params.idMiniGame}`)
  async findById(@Param(Params.idMiniGame) idMiniGame: number): Promise<MiniGame> {
    return this.miniGameService.findById(idMiniGame);
  }
}
