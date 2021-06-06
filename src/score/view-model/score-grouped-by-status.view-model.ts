import { Property } from '../../mapper/property.decorator';
import { ScoreViewModel } from './score.view-model';

export class ScoreGroupedByStatusViewModel {
  @Property() idScoreStatus!: number;
  @Property() description!: string;
  @Property() scores!: ScoreViewModel[];
}
