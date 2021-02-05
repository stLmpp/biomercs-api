import { Property } from '../../mapper/mapper.service';
import { PaginationMeta } from '../../shared/view-model/pagination.view-model';
import { ScoreViewModel } from './score.view-model';

export class ScoreApprovalViewModel {
  @Property() meta!: PaginationMeta;
  @Property() scores!: ScoreViewModel[];
}
