import { ScoreViewModel } from './score.view-model';
import { PaginationMeta } from '../../shared/view-model/pagination.view-model';
import { StageViewModel } from '../../stage/stage.view-model';
import { Property } from '../../mapper/property.decorator';

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
