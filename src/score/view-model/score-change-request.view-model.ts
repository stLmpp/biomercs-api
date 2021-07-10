import { ScoreViewModel } from './score.view-model';
import { PaginationMeta } from '../../shared/view-model/pagination.view-model';
import { Property } from '../../mapper/property.decorator';
import { ScoreChangeRequestViewModel } from '../score-change-request/score-change-request.view-model';

export class ScoreWithScoreChangeRequestsViewModel extends ScoreViewModel {
  @Property(() => ScoreChangeRequestViewModel) scoreChangeRequests!: ScoreChangeRequestViewModel[];
}

export class ScoreChangeRequestsPaginationViewModel {
  @Property(() => PaginationMeta) meta!: PaginationMeta;
  @Property(() => ScoreWithScoreChangeRequestsViewModel) scores!: ScoreWithScoreChangeRequestsViewModel[];
}
