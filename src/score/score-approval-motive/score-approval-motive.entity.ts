import { BaseEntity } from '../../shared/super/base-entity';
import { Column, Entity } from 'typeorm';
import { ScoreApprovalActionEnum } from '../score-approval/score-approval-action.enum';
import { Property } from '../../mapper/property.decorator';

@Entity()
export class ScoreApprovalMotive extends BaseEntity {
  @Property()
  @Column()
  description!: string;

  @Property()
  @Column({ type: 'enum', enum: ScoreApprovalActionEnum })
  action!: ScoreApprovalActionEnum;
}
