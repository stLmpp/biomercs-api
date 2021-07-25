import { Property } from '../../mapper/property.decorator';
import { ScoreViewModel } from './score.view-model';
import { Score } from '../score.entity';
import { ScoreStatus } from '../score-status/score-status.entity';

export class ScoresGroupedByStatus {
  constructor(scoreStatus: ScoreStatus, scores: Score[]) {
    this.scoreStatus = scoreStatus;
    this.scores = scores;
  }

  @Property(() => ScoreStatus) scoreStatus!: ScoreStatus;
  @Property(() => Score) scores!: Score[];
}

export class ScoresGroupedByStatusViewModel {
  @Property() idScoreStatus!: number;
  @Property() description!: string;
  @Property(() => ScoreViewModel) scores!: ScoreViewModel[];
}
