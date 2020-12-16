import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../auth/api-auth.decorator';
import { ScoreService } from './score.service';
import { ScoreAddDto } from './score.dto';
import { Params } from '../shared/type/params';
import { ScoreViewModel } from './view-model/score.view-model';
import { Score } from './score.entity';
import { ScoreTableViewModel } from './view-model/score-table.view-model';

@ApiAuth()
@ApiTags('Score')
@Controller('score')
export class ScoreController {
  constructor(private scoreService: ScoreService) {}

  @Post()
  async add(@Body() dto: ScoreAddDto): Promise<ScoreViewModel> {
    return this.scoreService.add(dto);
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

  @Get(
    `platform/:${Params.idPlatform}/game/:${Params.idGame}/mini-game/:${Params.idMiniGame}/mode/:${Params.idMode}/score-table`
  )
  async findScoreTable(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number,
    @Param(Params.idMode) idMode: number
  ): Promise<ScoreTableViewModel[]> {
    return this.scoreService.findScoreTable(idPlatform, idGame, idMiniGame, idMode);
  }

  @Get(`:${Params.idScore}`)
  async findByIdMapped(@Param(Params.idScore) idScore: number): Promise<ScoreViewModel> {
    return this.scoreService.findByIdMapped(idScore);
  }
}
