import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MiniGameService } from './mini-game.service';
import { MiniGame } from './mini-game.entity';
import { MiniGameAddDto, MiniGameUpdateDto } from './mini-game.dto';
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

  @Get()
  async findAll(): Promise<MiniGame[]> {
    return this.miniGameService.findAll();
  }

  @Get(`:${Params.idMiniGame}`)
  async findById(@Param(Params.idMiniGame) idMiniGame: number): Promise<MiniGame> {
    return this.miniGameService.findById(idMiniGame);
  }
}
