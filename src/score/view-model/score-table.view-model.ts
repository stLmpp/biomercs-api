import { Property } from '../../mapper/mapper.service';
import { ScoreViewModel } from './score.view-model';
import { Stage } from '../../stage/stage.entity';
import { PaginationMeta } from '../../shared/view-model/pagination.view-model';

export class ScoreTopTableViewModel {
  @Property() stages!: Stage[];
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
