import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MiniGameService } from './mini-game.service';
import { MiniGameAddDto, MiniGamePlatformsGamesDto, MiniGameUpdateDto } from './mini-game.dto';
import { Params } from '../shared/type/params';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { ApiAuth } from '../auth/api-auth.decorator';
import { ScoreStatusEnum } from '../score/score-status/score-status.enum';
import { MiniGameViewModel } from './mini-game.view-model';
import { InjectMapProfile } from '../mapper/inject-map-profile';
import { MiniGame } from './mini-game.entity';
import { MapProfile } from '../mapper/map-profile';

@ApiAuth()
@ApiTags('Mini game')
@Controller('mini-game')
export class MiniGameController {
  constructor(
    private miniGameService: MiniGameService,
    @InjectMapProfile(MiniGame, MiniGameViewModel) private mapProfile: MapProfile<MiniGame, MiniGameViewModel>
  ) {}

  @ApiAdmin()
  @Post()
  async add(@Body() dto: MiniGameAddDto): Promise<MiniGameViewModel> {
    return this.mapProfile.map(await this.miniGameService.add(dto));
  }

  @ApiAdmin()
  @Patch(`:${Params.idMiniGame}`)
  async update(
    @Param(Params.idMiniGame) idMiniGame: number,
    @Body() dto: MiniGameUpdateDto
  ): Promise<MiniGameViewModel> {
    return this.mapProfile.map(await this.miniGameService.update(idMiniGame, dto));
  }

  @Get(`platform/:${Params.idPlatform}/game/:${Params.idGame}`)
  async findByIdPlatformGame(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number
  ): Promise<MiniGameViewModel[]> {
    return this.mapProfile.map(await this.miniGameService.findByIdPlatformGame(idPlatform, idGame));
  }

  @Get(`platforms/games`)
  async findByIdPlatformsGames(@Query() dto: MiniGamePlatformsGamesDto): Promise<MiniGameViewModel[]> {
    return this.mapProfile.map(await this.miniGameService.findByIdPlatformsGames(dto));
  }

  @ApiAdmin()
  @Get(`approval/platform/:${Params.idPlatform}/game/:${Params.idGame}`)
  async findApprovalAdminByIdPlatformGame(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number
  ): Promise<MiniGameViewModel[]> {
    return this.mapProfile.map(
      await this.miniGameService.findApprovalByIdPlatformGame(ScoreStatusEnum.AwaitingApproval, idPlatform, idGame)
    );
  }

  @Get(`:${Params.idMiniGame}`)
  async findById(@Param(Params.idMiniGame) idMiniGame: number): Promise<MiniGameViewModel> {
    return this.mapProfile.map(await this.miniGameService.findById(idMiniGame));
  }
}
