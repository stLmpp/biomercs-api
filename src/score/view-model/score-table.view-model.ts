import { Property } from '../../mapper/mapper.service';
import { ScoreViewModel } from './score.view-model';
import { PaginationMeta } from '../../shared/view-model/pagination.view-model';
import { StageViewModel } from '../../stage/stage.view-model';

export class ScoreTopTableViewModel {
  @Property() stages!: StageViewModel[];
  @Property() scoreTables!: ScoreTableViewModel[];
  @Property() meta!: PaginationMeta;
}

export class ScoreTableViewModel {
  @Property() idPlayer!: number;
  @Property() personaName!: string;
  @Property() total!: number;
  @Property() position!: number;
  @Property() scores!: (ScoreViewModel | undefined)[];
}
