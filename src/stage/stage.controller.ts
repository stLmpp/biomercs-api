import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StageService } from './stage.service';
import { Stage } from './stage.entity';
import { StageAddDto, StageUpdateDto } from './stage.dto';
import { Params } from '../shared/type/params';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { ApiAuth } from '../auth/api-auth.decorator';

@ApiAuth()
@ApiTags('Stage')
@Controller('stage')
export class StageController {
  constructor(private stageService: StageService) {}

  @ApiAdmin()
  @Post()
  async add(@Body() dto: StageAddDto): Promise<Stage> {
    return this.stageService.add(dto);
  }

  @ApiAdmin()
  @Patch(`:${Params.idStage}`)
  async update(@Param(Params.idStage) idStage: number, @Body() dto: StageUpdateDto): Promise<Stage> {
    return this.stageService.update(idStage, dto);
  }

  @Get(`platform/:${Params.idPlatform}/game/:${Params.idGame}/mini-game/:${Params.idMiniGame}/mode/:${Params.idMode}`)
  async findByIdPlatformGameMiniGameMode(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number,
    @Param(Params.idMode) idMode: number
  ): Promise<Stage[]> {
    return this.stageService.findByIdPlatformGameMiniGameMode(idPlatform, idGame, idMiniGame, idMode);
  }

  @Get(`:${Params.idStage}`)
  async findById(@Param(Params.idStage) idStage: number): Promise<Stage> {
    return this.stageService.findById(idStage);
  }
}
