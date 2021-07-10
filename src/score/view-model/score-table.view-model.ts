import { ScoreViewModel } from './score.view-model';
import { PaginationMeta } from '../../shared/view-model/pagination.view-model';
import { StageViewModel } from '../../stage/stage.view-model';
import { Property } from '../../mapper/property.decorator';
import { PlatformGameMiniGameModeStage } from '../../platform/platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.entity';
import { Score } from '../score.entity';
import { Player } from '../../player/player.entity';

export class ScoreTable {
  @Property() total!: number;
  @Property() position!: number;
  @Property(() => Player) player!: Player;
  @Property(() => Score) scores!: (Score | undefined)[];
}

export class ScoreTopTable {
  constructor(
    platformGameMiniGameModeStages: PlatformGameMiniGameModeStage[],
    scoreTables: ScoreTable[],
    meta: PaginationMeta
  ) {
    this.platformGameMiniGameModeStages = platformGameMiniGameModeStages;
    this.scoreTables = scoreTables;
    this.meta = meta;
  }

  @Property(() => PlatformGameMiniGameModeStage) platformGameMiniGameModeStages!: PlatformGameMiniGameModeStage[];
  @Property(() => ScoreTable) scoreTables!: ScoreTable[];
  @Property(() => PaginationMeta) meta!: PaginationMeta;
}

export class ScoreTopTableViewModel {
  @Property(() => StageViewModel) stages!: StageViewModel[];
  @Property(() => ScoreTableViewModel) scoreTables!: ScoreTableViewModel[];
  @Property(() => PaginationMeta) meta!: PaginationMeta;
}

export class ScoreTableViewModel {
  @Property() idPlayer!: number;
  @Property() personaName!: string;
  @Property() total!: number;
  @Property() position!: number;
  @Property(() => ScoreViewModel) scores!: (ScoreViewModel | undefined)[];
}

export class ScoreTopTableWorldRecordViewModel {
  @Property(() => StageViewModel) stages!: StageViewModel[];
  @Property(() => ScoreTableWorldRecordViewModel) scoreTables!: ScoreTableWorldRecordViewModel[];
}

export class ScoreTableWorldRecordViewModel {
  @Property() idCharacterCostume!: number;
  @Property() idCharacter!: number;
  @Property() characterName!: string;
  @Property() characterCostumeName!: string;
  @Property() characterCostumeShortName!: string;
  @Property(() => ScoreViewModel) scores!: (ScoreViewModel | undefined)[];
}
