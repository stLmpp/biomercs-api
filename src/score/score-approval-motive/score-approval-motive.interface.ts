import { ScoreApprovalActionEnum } from '../score-approval/score-approval-action.enum';

export interface ScoreApprovalMotiveInterface {
  id: number;
  description: string;
  action: ScoreApprovalActionEnum;
}
