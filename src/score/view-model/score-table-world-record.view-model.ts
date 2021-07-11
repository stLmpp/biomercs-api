import { Property } from '../../mapper/property.decorator';
import { StageViewModel } from '../../stage/stage.view-model';
import { ScoreViewModel } from './score.view-model';
import { Score } from '../score.entity';
import { Stage } from '../../stage/stage.entity';

export class ScoreTableWorldRecord {
  constructor(scores: (Score | undefined)[]) {
    this.scores = scores;
  }

  @Property() idCharacterCostume!: number;
  @Property() idCharacter!: number;
  @Property() characterName!: string;
  @Property() characterCostumeName!: string;
  @Property() characterCostumeShortName!: string;
  @Property(() => Score) scores!: (Score | undefined)[];
}

export class ScoreTableWorldRecordViewModel {
  @Property() idCharacterCostume!: number;
  @Property() idCharacter!: number;
  @Property() characterName!: string;
  @Property() characterCostumeName!: string;
  @Property() characterCostumeShortName!: string;
  @Property(() => ScoreViewModel) scores!: (ScoreViewModel | undefined)[];
}

export class ScoreTopTableWorldRecord {
  constructor(scoreTables: ScoreTableWorldRecord[], stages: Stage[]) {
    this.scoreTables = scoreTables;
    this.stages = stages;
  }

  @Property(() => Stage) stages!: Stage[];
  @Property(() => ScoreTableWorldRecord) scoreTables!: ScoreTableWorldRecord[];
}

export class ScoreTopTableWorldRecordViewModel {
  @Property(() => StageViewModel) stages!: StageViewModel[];
  @Property(() => ScoreTableWorldRecordViewModel) scoreTables!: ScoreTableWorldRecordViewModel[];
}
