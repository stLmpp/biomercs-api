import { ScoreViewModel } from './score.view-model';
import { PaginationMeta } from '../../shared/view-model/pagination.view-model';
import { Property } from '../../mapper/property.decorator';

export class ScoreChangeRequestsViewModel extends ScoreViewModel {
  @Property(() => ScoreChangeRequestViewModel) scoreChangeRequests!: ScoreChangeRequestViewModel[];
}

export class ScoreChangeRequestViewModel {
  @Property() idScoreChangeRequest!: number;
  @Property() description!: string;
}

export class ScoreChangeRequestsPaginationViewModel {
  @Property(() => PaginationMeta) meta!: PaginationMeta;
  @Property(() => ScoreChangeRequestsViewModel) scores!: ScoreChangeRequestsViewModel[];
}
