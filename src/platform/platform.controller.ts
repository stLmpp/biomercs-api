import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlatformService } from './platform.service';
import { PlatformAddDto, PlatformUpdateDto } from './platform.dto';
import { Params } from '../shared/type/params';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { ApiAuth } from '../auth/api-auth.decorator';
import { PlatformGameMiniGameService } from './platform-game-mini-game/platform-game-mini-game.service';
import { PlatformGameMiniGame } from './platform-game-mini-game/platform-game-mini-game.entity';
import { PlatformGameMiniGameModeService } from './platform-game-mini-game-mode/platform-game-mini-game-mode.service';
import { PlatformGameMiniGameMode } from './platform-game-mini-game-mode/platform-game-mini-game-mode.entity';
import { PlatformGameMiniGameModeStageService } from './platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.service';
import { PlatformGameMiniGameModeCharacterCostumeService } from './platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.service';
import { PlatformGameMiniGameModeCharacterCostume } from './platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.entity';
import { PlatformGameMiniGameModeStage } from './platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.entity';
import { ScoreStatusEnum } from '../score/score-status/score-status.enum';
import { PlatformViewModel } from './platform.view-model';
import { InjectMapProfile } from '../mapper/inject-map-profile';
import { Platform } from './platform.entity';
import { MapProfile } from '../mapper/map-profile';
import { PlatformGameMiniGameViewModel } from './platform-game-mini-game/platform-game-mini-game.view-model';
import { PlatformGameMiniGameModeViewModel } from './platform-game-mini-game-mode/platform-game-mini-game-mode.view-model';
import { PlatformGameMiniGameModeCharacterCostumeViewModel } from './platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.view-model';
import { PlatformGameMiniGameModeStageViewModel } from './platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.view-model';

@ApiAuth()
@ApiTags('Platform')
@Controller('platform')
export class PlatformController {
  constructor(
    private platformService: PlatformService,
    private platformGameMiniGameService: PlatformGameMiniGameService,
    private platformGameMiniGameModeService: PlatformGameMiniGameModeService,
    private platformGameMiniGameModeCharacterCostumeService: PlatformGameMiniGameModeCharacterCostumeService,
    private platformGameMiniGameModeStageService: PlatformGameMiniGameModeStageService,
    @InjectMapProfile(Platform, PlatformViewModel) private mapProfile: MapProfile<Platform, PlatformViewModel>,
    @InjectMapProfile(PlatformGameMiniGame, PlatformGameMiniGameViewModel)
    private mapProfilePlatformGameMiniGame: MapProfile<PlatformGameMiniGame, PlatformGameMiniGameViewModel>,
    @InjectMapProfile(PlatformGameMiniGameMode, PlatformGameMiniGameModeViewModel)
    private mapProfilePlatformGameMiniGameMode: MapProfile<PlatformGameMiniGameMode, PlatformGameMiniGameModeViewModel>,
    @InjectMapProfile(PlatformGameMiniGameModeCharacterCostume, PlatformGameMiniGameModeCharacterCostumeViewModel)
    private mapProfilePlatformGameMiniGameModeCharacterCostume: MapProfile<
      PlatformGameMiniGameModeCharacterCostume,
      PlatformGameMiniGameModeCharacterCostumeViewModel
    >,
    @InjectMapProfile(PlatformGameMiniGameModeStage, PlatformGameMiniGameModeStageViewModel)
    private mapProfilePlatformGameMiniGameModeStage: MapProfile<
      PlatformGameMiniGameModeStage,
      PlatformGameMiniGameModeStageViewModel
    >
  ) {}

  @ApiAdmin()
  @Post()
  async add(@Body() dto: PlatformAddDto): Promise<PlatformViewModel> {
    return this.mapProfile.map(await this.platformService.add(dto));
  }

  @ApiAdmin()
  @Patch(`:${Params.idPlatform}`)
  async update(
    @Param(Params.idPlatform) idPlatform: number,
    @Body() dto: PlatformUpdateDto
  ): Promise<PlatformViewModel> {
    return this.mapProfile.map(await this.platformService.update(idPlatform, dto));
  }

  @ApiAdmin()
  @Put(`:${Params.idPlatform}/link/game/:${Params.idGame}/mini-game/:${Params.idMiniGame}`)
  async linkGameMiniGame(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number
  ): Promise<PlatformGameMiniGameViewModel> {
    return this.mapProfilePlatformGameMiniGame.map(
      await this.platformGameMiniGameService.link(idPlatform, idGame, idMiniGame)
    );
  }

  @ApiAdmin()
  @Delete(`:${Params.idPlatform}/unlink/game/:${Params.idGame}/mini-game/:${Params.idMiniGame}`)
  async unlinkGameMiniGame(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number
  ): Promise<void> {
    await this.platformGameMiniGameService.unlink(idPlatform, idGame, idMiniGame);
  }

  @ApiAdmin()
  @Put(`:${Params.idPlatform}/link/game/:${Params.idGame}/mini-game/:${Params.idMiniGame}/mode/:${Params.idMode}`)
  async linkGameMiniGameMode(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number,
    @Param(Params.idMode) idMode: number
  ): Promise<PlatformGameMiniGameModeViewModel> {
    return this.mapProfilePlatformGameMiniGameMode.map(
      await this.platformGameMiniGameModeService.link(idPlatform, idGame, idMiniGame, idMode)
    );
  }

  @ApiAdmin()
  @Delete(`:${Params.idPlatform}/unlink/game/:${Params.idGame}/mini-game/:${Params.idMiniGame}/mode/:${Params.idMode}`)
  async unlinkGameMiniGameMode(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number,
    @Param(Params.idMode) idMode: number
  ): Promise<void> {
    await this.platformGameMiniGameModeService.unlink(idPlatform, idGame, idMiniGame, idMode);
  }

  @ApiAdmin()
  @Put(
    `:${Params.idPlatform}/link/game/:${Params.idGame}/mini-game/:${Params.idMiniGame}/mode/:${Params.idMode}/character-costume/:${Params.idCharacterCostume}`
  )
  async linkGameMiniGameModeCharacterCostume(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number,
    @Param(Params.idMode) idMode: number,
    @Param(Params.idCharacterCostume) idCharacterCostume: number
  ): Promise<PlatformGameMiniGameModeCharacterCostumeViewModel> {
    return this.mapProfilePlatformGameMiniGameModeCharacterCostume.map(
      await this.platformGameMiniGameModeCharacterCostumeService.link(
        idPlatform,
        idGame,
        idMiniGame,
        idMode,
        idCharacterCostume
      )
    );
  }

  @ApiAdmin()
  @Delete(
    `:${Params.idPlatform}/unlink/game/:${Params.idGame}/mini-game/:${Params.idMiniGame}/mode/:${Params.idMode}/character-costume/:${Params.idCharacterCostume}`
  )
  async unlinkGameMiniGameModeCharacterCostume(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number,
    @Param(Params.idMode) idMode: number,
    @Param(Params.idCharacterCostume) idCharacterCostume: number
  ): Promise<void> {
    await this.platformGameMiniGameModeCharacterCostumeService.unlink(
      idPlatform,
      idGame,
      idMiniGame,
      idMode,
      idCharacterCostume
    );
  }

  @ApiAdmin()
  @Put(
    `:${Params.idPlatform}/link/game/:${Params.idGame}/mini-game/:${Params.idMiniGame}/mode/:${Params.idMode}/state/:${Params.idStage}`
  )
  async linkGameMiniGameModeStage(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number,
    @Param(Params.idMode) idMode: number,
    @Param(Params.idStage) idStage: number
  ): Promise<PlatformGameMiniGameModeStageViewModel> {
    return this.mapProfilePlatformGameMiniGameModeStage.map(
      await this.platformGameMiniGameModeStageService.link(idPlatform, idGame, idMiniGame, idMode, idStage)
    );
  }

  @ApiAdmin()
  @Delete(
    `:${Params.idPlatform}/unlink/game/:${Params.idGame}/mini-game/:${Params.idMiniGame}/mode/:${Params.idMode}/state/:${Params.idStage}`
  )
  async unlinkGameMiniGameModeStage(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number,
    @Param(Params.idMode) idMode: number,
    @Param(Params.idStage) idStage: number
  ): Promise<void> {
    await this.platformGameMiniGameModeStageService.unlink(idPlatform, idGame, idMiniGame, idMode, idStage);
  }

  @Get()
  async findAll(): Promise<PlatformViewModel[]> {
    return this.mapProfile.map(await this.platformService.findAll());
  }

  @ApiAdmin()
  @Get('approval')
  async findApprovalAdmin(): Promise<PlatformViewModel[]> {
    return this.mapProfile.map(await this.platformService.findApproval(ScoreStatusEnum.AwaitingApproval));
  }

  @Get(`:${Params.idPlatform}`)
  async findById(@Param(Params.idPlatform) idPlatform: number): Promise<PlatformViewModel> {
    return this.mapProfile.map(await this.platformService.findById(idPlatform));
  }
}
