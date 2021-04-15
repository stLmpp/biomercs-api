import { PaginationMeta } from '../../shared/view-model/pagination.view-model';
import { ScoreViewModel } from './score.view-model';
import { Property } from '../../mapper/property.decorator';

export class ScoreApprovalViewModel {
  @Property(() => PaginationMeta) meta!: PaginationMeta;
  @Property(() => ScoreViewModel) scores!: ScoreViewModel[];
}
