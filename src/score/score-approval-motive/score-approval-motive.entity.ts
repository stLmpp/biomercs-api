import { BaseEntity } from '../../shared/super/base-entity';
import { Column, Entity } from 'typeorm';
import { ScoreApprovalActionEnum } from '../score-approval/score-approval-action.enum';
import { Property } from '../../mapper/property.decorator';
import { ScoreApprovalMotiveInterface } from './score-approval-motive.interface';
import { SchemaEnum } from '../../environment/schema.enum';

@Entity({ schema: SchemaEnum.main })
export class ScoreApprovalMotive extends BaseEntity implements ScoreApprovalMotiveInterface {
  @Property()
  @Column()
  description!: string;

  @Property()
  @Column({ type: 'enum', enum: ScoreApprovalActionEnum })
  action!: ScoreApprovalActionEnum;
}
