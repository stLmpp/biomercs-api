import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { Game } from './game.entity';
import { GameAddDto, GameUpdateDto } from './game.dto';
import { Params } from '../shared/type/params';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { ApiAuth } from '../auth/api-auth.decorator';

@ApiAuth()
@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

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

  @Get()
  async findAll(): Promise<Game[]> {
    return this.gameService.findAll();
  }

  @Get(`:${Params.idGame}`)
  async findById(@Param(Params.idGame) idGame: number): Promise<Game> {
    return this.gameService.findById(idGame);
  }
}
