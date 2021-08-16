import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { Score } from '../score.entity';
import { Player } from '../../player/player.entity';
import { User } from '../../user/user.entity';
import { ScoreApprovalActionEnum } from './score-approval-action.enum';
import { ScoreApprovalMotive } from '../score-approval-motive/score-approval-motive.entity';
import { Property } from '../../mapper/property.decorator';
import { SchemaEnum } from '../../environment/schema.enum';

@Entity({ schema: SchemaEnum.main })
export class ScoreApproval extends BaseEntity {
  @Property()
  @Column()
  idScore!: number;

  @Property(() => Score)
  @ManyToOne(() => Score)
  @JoinColumn()
  score!: Score;

  @Property()
  @Column()
  actionDate!: Date;

  @Property()
  @Column({ nullable: true })
  actionByPlayer?: number;

  @Property(() => Player)
  @ManyToOne(() => Player, { nullable: true })
  @JoinColumn({ name: 'actionByPlayer', referencedColumnName: 'id' })
  player?: Player;

  @Property()
  @Column({ nullable: true })
  actionByAdmin?: number;

  @Property(() => User)
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'actionByAdmin', referencedColumnName: 'id' })
  admin?: User;

  @Property()
  @Column({ nullable: true, length: 1000 })
  description?: string;

  @Property()
  @Column({ type: 'enum', enum: ScoreApprovalActionEnum })
  action!: ScoreApprovalActionEnum;

  @Property()
  @Column()
  idScoreApprovalMotive!: number;

  @Property(() => ScoreApprovalMotive)
  @ManyToOne(() => ScoreApprovalMotive)
  @JoinColumn()
  scoreApprovalMotive!: ScoreApprovalMotive;
}
