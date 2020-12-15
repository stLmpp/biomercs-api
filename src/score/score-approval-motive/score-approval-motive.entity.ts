import { BaseEntity } from '../../shared/super/base-entity';
import { Column, Entity } from 'typeorm';
import { ScoreApprovalActionEnum } from '../score-approval/score-approval-action.enum';

@Entity()
export class ScoreApprovalMotive extends BaseEntity {
  @Column()
  description!: string;

  @Column({ type: 'enum', enum: ScoreApprovalActionEnum })
  action!: ScoreApprovalActionEnum;
}
