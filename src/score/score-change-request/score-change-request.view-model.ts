import { Property } from '../../mapper/property.decorator';
import { ScoreChangeRequestInterface } from './score-change-request.interface';

export class ScoreChangeRequestViewModel implements ScoreChangeRequestInterface {
  @Property() id!: number;
  @Property() idScore!: number;
  @Property() description!: string;
  @Property() dateFulfilled?: Date;
}
