import { Property } from '../../mapper/mapper.service';
import { ScoreViewModel } from './score.view-model';

export class ScoreTableViewModel {
  @Property() idPlayer!: number;
  @Property() personaName!: string;
  @Property() total!: number;
  @Property() scores!: (ScoreViewModel | undefined)[];
}
