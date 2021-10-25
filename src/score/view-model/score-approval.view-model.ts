import { PaginationMeta } from '../../shared/view-model/pagination.view-model';
import { ScoreViewModel } from './score.view-model';
import { Property } from '../../mapper/property.decorator';
import { Score } from '../score.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

export class ScoreApprovalPagination {
  constructor(pagination: Pagination<Score, PaginationMeta>) {
    this.meta = pagination.meta;
    this.scores = pagination.items;
  }

  @Property(() => PaginationMeta) meta!: PaginationMeta;
  @Property(() => Score) scores!: Score[];
}

export class ScoreApprovalPaginationViewModel {
  @Property(() => PaginationMeta) meta!: PaginationMeta;
  @Property(() => ScoreViewModel) scores!: ScoreViewModel[];
}
