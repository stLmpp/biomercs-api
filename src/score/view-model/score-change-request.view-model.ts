import { Property } from '../../mapper/mapper.service';
import { ScoreViewModel } from './score.view-model';
import { PaginationMeta } from '../../shared/view-model/pagination.view-model';

export class ScoreChangeRequestsViewModel extends ScoreViewModel {
  @Property() scoreChangeRequests!: ScoreChangeRequestViewModel[];
}

export class ScoreChangeRequestViewModel {
  @Property() idScoreChangeRequest!: number;
  @Property() description!: string;
}

export class ScoreChangeRequestsPaginationViewModel {
  @Property() meta!: PaginationMeta;
  @Property() scores!: ScoreChangeRequestsViewModel[];
}
