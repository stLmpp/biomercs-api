import { mapperService } from './mapper.service';
import { GameViewModel } from '../game/game.view-model';
import { Game } from '../game/game.entity';
import { MiniGame } from '../mini-game/mini-game.entity';
import { MiniGameViewModel } from '../mini-game/mini-game.view-model';
import { Mode } from '../mode/mode.entity';
import { ModeViewModel } from '../mode/mode.view-model';
import { Platform } from '../platform/platform.entity';
import { PlatformViewModel } from '../platform/platform.view-model';
import { Player } from '../player/player.entity';
import { PlayerViewModel, PlayerWithRegionSteamProfileViewModel } from '../player/player.view-model';
import { Region } from '../region/region.entity';
import { RegionViewModel } from '../region/region.view-model';
import { Rule } from '../rule/rule.entity';
import { RuleViewModel } from '../rule/rule.view-model';
import { ScoreChangeRequest } from '../score/score-change-request/score-change-request.entity';
import {
  ScoreChangeRequestsViewModel,
  ScoreChangeRequestViewModel,
} from '../score/view-model/score-change-request.view-model';
import { ScorePlayer } from '../score/score-player/score-player.entity';
import { ScorePlayerViewModel, ScoreViewModel } from '../score/view-model/score.view-model';
import { Type } from '../util/type';
import { Score } from '../score/score.entity';
import { ScoreWorldRecordTypeEnum } from '../score/score-world-record/score-world-record-type.enum';
import { Stage } from '../stage/stage.entity';
import { StageViewModel } from '../stage/stage.view-model';
import { SteamProfile } from '../steam/steam-profile.entity';
import { SteamProfileViewModel, SteamProfileWithPlayerViewModel } from '../steam/steam-profile.view-model';
import { User } from '../user/user.entity';
import { UserViewModel } from '../user/user.view-model';
import { Provider } from '@nestjs/common';
import { MapProfile } from './map-profile';

const mapProfiles = [
  mapperService.create(Game, GameViewModel),
  mapperService.create(MiniGame, MiniGameViewModel),
  mapperService.create(Platform, PlatformViewModel),
  mapperService.create(Mode, ModeViewModel),
  mapperService.create(Player, PlayerViewModel),
  mapperService.create(Player, PlayerWithRegionSteamProfileViewModel),
  mapperService.create(Region, RegionViewModel),
  mapperService.create(Rule, RuleViewModel),
  mapperService.create(Stage, StageViewModel),
  mapperService.create(SteamProfile, SteamProfileViewModel),
  mapperService.create(SteamProfile, SteamProfileWithPlayerViewModel),
  mapperService.create(User, UserViewModel),
  mapperService.create(ScoreChangeRequest, ScoreChangeRequestViewModel).for(
    dest => dest.idScoreChangeRequest,
    from => from.id
  ),
  mapperService
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
    ),
  createScoreViewModeMap(ScoreViewModel),
  createScoreViewModeMap(ScoreChangeRequestsViewModel),
];

function createScoreViewModeMap<T extends ScoreViewModel>(type: Type<T>): MapProfile<Score, T> {
  return mapperService
    .create(Score, type)
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
      from =>
        mapperService.map(ScorePlayer, ScorePlayerViewModel, from.scorePlayers).map(scorePlayer => {
          const characterWorldRecord = (from.scoreWorldRecords ?? []).find(
            scoreWorldRecord =>
              scoreWorldRecord.type === ScoreWorldRecordTypeEnum.CharacterWorldRecord &&
              scoreWorldRecord.scoreWorldRecordCharacters.some(
                scoreWorldRecordCharacter =>
                  scoreWorldRecordCharacter.idPlatformGameMiniGameModeCharacterCostume ===
                  scorePlayer.idPlatformGameMiniGameModeCharacterCostume
              )
          );
          scorePlayer.isCharacterWorldRecord = !!characterWorldRecord;
          return scorePlayer;
        })
    )
    .for(
      dest => dest.isWorldRecord,
      from =>
        (from.scoreWorldRecords ?? []).some(
          scoreWorldRecord => scoreWorldRecord.type === ScoreWorldRecordTypeEnum.WorldRecord
        )
    )
    .for(
      dest => dest.isCharacterWorldRecord,
      from =>
        (from.scoreWorldRecords ?? []).some(
          scoreWorldRecord => scoreWorldRecord.type === ScoreWorldRecordTypeEnum.CharacterWorldRecord
        )
    )
    .for(
      dest => dest.isCombinationWorldRecord,
      from =>
        (from.scoreWorldRecords ?? []).some(
          scoreWorldRecord => scoreWorldRecord.type === ScoreWorldRecordTypeEnum.CombinationWorldRecord
        )
    )
    .for(
      dest => dest.idScoreStatus,
      from => from.scoreStatus.id
    )
    .for(
      dest => dest.scoreStatusDescription,
      from => from.scoreStatus.description
    );
}

export const mapProfileTokens = mapProfiles.map(mapProfile => mapProfile.token);
export const mapProfileProviders: Provider[] = mapProfiles.map(mapProfile => ({
  provide: mapProfile.token,
  useValue: mapProfile,
}));
