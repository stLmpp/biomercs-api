import { ScoreApprovalMotiveInterface } from './score-approval-motive.interface';
import { ScoreApprovalActionEnum } from '../score-approval/score-approval-action.enum';
import { Property } from '../../mapper/property.decorator';

export class ScoreApprovalMotiveViewModel implements ScoreApprovalMotiveInterface {
  @Property() action!: ScoreApprovalActionEnum;
  @Property() description!: string;
  @Property() id!: number;
}
