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
import { ScoreWithScoreChangeRequestsViewModel } from '../score/view-model/score-change-request.view-model';
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
import { CharacterCostume } from '../character/character-costume/character-costume.entity';
import { CharacterCostumeViewModel } from '../character/character-costume/character-costume.view-model';
import { Character } from '../character/character.entity';
import { CharacterViewModel, CharacterViewModelWithCharacterCostumes } from '../character/character.view-model';
import { GameMiniGame } from '../game/game-mini-game/game-mini-game.entity';
import { GameMiniGameViewModel } from '../game/game-mini-game/game-mini-game.view-model';
import { PlatformGameMiniGame } from '../platform/platform-game-mini-game/platform-game-mini-game.entity';
import { PlatformGameMiniGameViewModel } from '../platform/platform-game-mini-game/platform-game-mini-game.view-model';
import { PlatformGameMiniGameMode } from '../platform/platform-game-mini-game-mode/platform-game-mini-game-mode.entity';
import { PlatformGameMiniGameModeViewModel } from '../platform/platform-game-mini-game-mode/platform-game-mini-game-mode.view-model';
import { PlatformGameMiniGameModeCharacterCostume } from '../platform/platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.entity';
import { PlatformGameMiniGameModeCharacterCostumeViewModel } from '../platform/platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.view-model';
import { PlatformGameMiniGameModeStage } from '../platform/platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.entity';
import { PlatformGameMiniGameModeStageViewModel } from '../platform/platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.view-model';
import { ScoreApprovalMotive } from '../score/score-approval-motive/score-approval-motive.entity';
import { ScoreApprovalMotiveViewModel } from '../score/score-approval-motive/score-approval-motive.view-model';
import { ScoreChangeRequestViewModel } from '../score/score-change-request/score-change-request.view-model';
import {
  ScoreTable,
  ScoreTableViewModel,
  ScoreTopTable,
  ScoreTopTableViewModel,
} from '../score/view-model/score-table.view-model';
import {
  ScoreApprovalPagination,
  ScoreApprovalPaginationViewModel,
} from '../score/view-model/score-approval.view-model';
import {
  ScoreTableWorldRecord,
  ScoreTableWorldRecordViewModel,
  ScoreTopTableWorldRecord,
  ScoreTopTableWorldRecordViewModel,
} from '../score/view-model/score-table-world-record.view-model';
import {
  ScoresGroupedByStatus,
  ScoresGroupedByStatusViewModel,
} from '../score/view-model/score-grouped-by-status.view-model';
import { SteamPlayerLinkedSocket, SteamPlayerLinkedSocketViewModel } from '../steam/steam-player-linked.view-model';
import { ErrorEntity } from '../error/error.entity';
import { ErrorViewModel } from '../error/error.view-model';
import { format } from 'sql-formatter';
import { isString } from 'st-utils';
import { InputType } from '../input-type/input-type.entity';
import { InputTypeViewModel } from '../input-type/input-type.view-model';
import { Notification } from '../notification/notification.entity';
import { NotificationViewModel } from '../notification/notification.view-model';

const mapProfiles: MapProfile<any, any>[] = [
  mapperService.create(Game, GameViewModel),
  mapperService.create(MiniGame, MiniGameViewModel),
  mapperService.create(Platform, PlatformViewModel),
  mapperService.create(Mode, ModeViewModel),
  mapperService.create(Player, PlayerViewModel).for(
    dest => dest.inputTypeName,
    from => from.inputType?.name
  ),
  mapperService.create(Player, PlayerWithRegionSteamProfileViewModel),
  mapperService.create(Region, RegionViewModel),
  mapperService.create(Rule, RuleViewModel),
  mapperService.create(Stage, StageViewModel),
  mapperService.create(SteamProfile, SteamProfileViewModel),
  mapperService.create(SteamProfile, SteamProfileWithPlayerViewModel),
  mapperService
    .create(User, UserViewModel)
    .for(
      dest => dest.idPlayer,
      from => from.player?.id
    )
    .for(
      dest => dest.playerPersonaName,
      from => from.player?.personaName
    ),
  mapperService.create(CharacterCostume, CharacterCostumeViewModel),
  mapperService.create(Character, CharacterViewModel),
  mapperService.create(Character, CharacterViewModelWithCharacterCostumes),
  mapperService.create(GameMiniGame, GameMiniGameViewModel),
  mapperService.create(PlatformGameMiniGame, PlatformGameMiniGameViewModel),
  mapperService.create(PlatformGameMiniGameMode, PlatformGameMiniGameModeViewModel),
  mapperService.create(PlatformGameMiniGameModeCharacterCostume, PlatformGameMiniGameModeCharacterCostumeViewModel),
  mapperService.create(PlatformGameMiniGameModeStage, PlatformGameMiniGameModeStageViewModel),
  mapperService.create(ScoreApprovalMotive, ScoreApprovalMotiveViewModel),
  mapperService.create(ScoreChangeRequest, ScoreChangeRequestViewModel),
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
      dest => dest.inputTypeName,
      from => from.platformInputType?.inputType?.name
    )
    .for(
      dest => dest.idInputType,
      from => from.platformInputType?.idInputType
    ),
  createScoreViewModeMap(ScoreViewModel),
  createScoreViewModeMap(ScoreWithScoreChangeRequestsViewModel),
  mapperService
    .create(ScoreTable, ScoreTableViewModel)
    .for(
      dest => dest.idPlayer,
      from => from.player.id
    )
    .for(
      dest => dest.personaName,
      from => from.player.personaName
    ),
  mapperService.create(ScoreTopTable, ScoreTopTableViewModel).for(
    dest => dest.stages,
    from =>
      from.platformGameMiniGameModeStages.map(platformGameMiniGameModeStage => platformGameMiniGameModeStage.stage)
  ),
  mapperService.create(ScoreApprovalPagination, ScoreApprovalPaginationViewModel),
  mapperService.create(ScoreTableWorldRecord, ScoreTableWorldRecordViewModel),
  mapperService.create(ScoreTopTableWorldRecord, ScoreTopTableWorldRecordViewModel),
  mapperService
    .create(ScoresGroupedByStatus, ScoresGroupedByStatusViewModel)
    .for(
      dest => dest.description,
      from => from.scoreStatus.description
    )
    .for(
      dest => dest.idScoreStatus,
      from => from.scoreStatus.id
    ),
  mapperService.create(SteamPlayerLinkedSocket, SteamPlayerLinkedSocketViewModel),
  mapperService
    .create(ErrorEntity, ErrorViewModel)
    .for(
      dest => dest.createdByUsername,
      from => from.createdByUser?.username
    )
    .for(
      dest => dest.stack,
      from => from.stack.replace(new RegExp(process.cwd(), 'g'), '')
    )
    .for(
      dest => dest.sqlQuery,
      from => from.sqlQuery && format(from.sqlQuery, { language: 'postgresql' })
    )
    .for(
      dest => dest.sqlQueryWithParameters,
      from => {
        if (!from.sqlQuery || !from.sqlParameters?.length) {
          return undefined;
        }
        let query = from.sqlQuery;
        for (let index = 0, length = from.sqlParameters.length; index < length; index++) {
          let param = from.sqlParameters[index];
          if (isString(param)) {
            param = `'${param.replace(/'/g, `\\'`)}'`;
          }
          query = query.replace(`$${index + 1}`, param + '');
        }
        return format(query, { language: 'postgresql' });
      }
    ),
  mapperService.create(InputType, InputTypeViewModel),
  mapperService.create(Notification, NotificationViewModel).for(
    dest => dest.idScoreStatus,
    from => from.score?.idScoreStatus ?? null
  ),
];

function createScoreViewModeMap<T extends ScoreViewModel>(type: Type<T>): MapProfile<Score, T> {
  return mapperService
    .create(Score, type)
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
