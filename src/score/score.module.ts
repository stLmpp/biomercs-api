import { Module } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreRepository } from './score.repository';
import { ScorePlayerModule } from './score-player/score-player.module';
import { ScoreApprovalModule } from './score-approval/score-approval.module';
import { ScoreApprovalMotiveModule } from './score-approval-motive/score-approval-motive.module';
import { PlatformGameMiniGameModeStageModule } from '../platform/platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.module';
import { ModeModule } from '../mode/mode.module';
import { MapperModule } from '../mapper/mapper.module';
import { MapperService } from '../mapper/mapper.service';
import { Score } from './score.entity';
import { ScorePlayerViewModel, ScoreViewModel } from './view-model/score.view-model';
import { ScorePlayer } from './score-player/score-player.entity';
import { PlatformGameMiniGameModeCharacterCostumeModule } from '../platform/platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.module';
import { PlayerModule } from '../player/player.module';
import { StageModule } from '../stage/stage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScoreRepository]),
    ScorePlayerModule,
    ScoreApprovalModule,
    ScoreApprovalMotiveModule,
    PlatformGameMiniGameModeStageModule,
    ModeModule,
    MapperModule,
    PlatformGameMiniGameModeCharacterCostumeModule,
    PlayerModule,
    StageModule,
  ],
  providers: [ScoreService],
  controllers: [ScoreController],
  exports: [ScoreService, ScorePlayerModule, ScoreApprovalModule, ScoreApprovalMotiveModule],
})
export class ScoreModule {
  constructor(private mapperService: MapperService) {
    this.mapperService
      .create(ScorePlayer, ScorePlayerViewModel)
      .for(
        dest => dest.playerPersonaName,
        from => from.player.personaName
      )
      .for(
        dest => dest.idCharacterCostume,
        from => from.platformGameMiniGameModeCharacterCostume.idCharacterCostume
      )
      .for(
        dest => dest.characterCostumeName,
        from => from.platformGameMiniGameModeCharacterCostume.characterCostume.name
      )
      .for(
        dest => dest.characterCostumeShortName,
        from => from.platformGameMiniGameModeCharacterCostume.characterCostume.shortName
      )
      .for(
        dest => dest.idCharacter,
        from => from.platformGameMiniGameModeCharacterCostume.characterCostume.idCharacter
      )
      .for(
        dest => dest.characterName,
        from => from.platformGameMiniGameModeCharacterCostume.characterCostume.character.name
      )
      .for(
        dest => dest.idScorePlayer,
        from => from.id
      );

    this.mapperService
      .create(Score, ScoreViewModel)
      .for(
        dest => dest.idScore,
        from => from.id
      )
      .for(
        dest => dest.idPlatformGameMiniGameMode,
        from => from.platformGameMiniGameModeStage.idPlatformGameMiniGameMode
      )
      .for(
        dest => dest.idMode,
        from => from.platformGameMiniGameModeStage.platformGameMiniGameMode.idMode
      )
      .for(
        dest => dest.modeName,
        from => from.platformGameMiniGameModeStage.platformGameMiniGameMode.mode.name
      )
      .for(
        dest => dest.idPlatformGameMiniGame,
        from => from.platformGameMiniGameModeStage.platformGameMiniGameMode.idPlatformGameMiniGame
      )
      .for(
        dest => dest.idPlatform,
        from => from.platformGameMiniGameModeStage.platformGameMiniGameMode.platformGameMiniGame.idPlatform
      )
      .for(
        dest => dest.platformName,
        from => from.platformGameMiniGameModeStage.platformGameMiniGameMode.platformGameMiniGame.platform.name
      )
      .for(
        dest => dest.platformShortName,
        from => from.platformGameMiniGameModeStage.platformGameMiniGameMode.platformGameMiniGame.platform.shortName
      )
      .for(
        dest => dest.idGame,
        from => from.platformGameMiniGameModeStage.platformGameMiniGameMode.platformGameMiniGame.gameMiniGame.idGame
      )
      .for(
        dest => dest.gameName,
        from => from.platformGameMiniGameModeStage.platformGameMiniGameMode.platformGameMiniGame.gameMiniGame.game.name
      )
      .for(
        dest => dest.gameShortName,
        from =>
          from.platformGameMiniGameModeStage.platformGameMiniGameMode.platformGameMiniGame.gameMiniGame.game.shortName
      )
      .for(
        dest => dest.idMiniGame,
        from => from.platformGameMiniGameModeStage.platformGameMiniGameMode.platformGameMiniGame.gameMiniGame.idMiniGame
      )
      .for(
        dest => dest.miniGameName,
        from =>
          from.platformGameMiniGameModeStage.platformGameMiniGameMode.platformGameMiniGame.gameMiniGame.miniGame.name
      )
      .for(
        dest => dest.idGameMiniGame,
        from => from.platformGameMiniGameModeStage.platformGameMiniGameMode.platformGameMiniGame.idGameMiniGame
      )
      .for(
        dest => dest.idStage,
        from => from.platformGameMiniGameModeStage.idStage
      )
      .for(
        dest => dest.stageName,
        from => from.platformGameMiniGameModeStage.stage.name
      )
      .for(
        dest => dest.stageShortName,
        from => from.platformGameMiniGameModeStage.stage.shortName
      )
      .for(
        dest => dest.scorePlayers,
        from => this.mapperService.map(ScorePlayer, ScorePlayerViewModel, from.scorePlayers)
      );
  }
}
