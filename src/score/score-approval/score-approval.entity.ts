import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { Score } from '../score.entity';
import { Player } from '../../player/player.entity';
import { User } from '../../user/user.entity';
import { ScoreApprovalActionEnum } from './score-approval-action.enum';
import { ScoreApprovalMotive } from '../score-approval-motive/score-approval-motive.entity';

@Entity()
export class ScoreApproval extends BaseEntity {
  @Column()
  idScore!: number;

  @ManyToOne(() => Score)
  @JoinColumn()
  score!: Score;

  @Column()
  actionDate!: Date;

  @Column({ nullable: true })
  actionByPlayer?: number;

  @ManyToOne(() => Player, { nullable: true })
  @JoinColumn({ name: 'actionByPlayer', referencedColumnName: 'id' })
  player?: Player;

  @Column({ nullable: true })
  actionByAdmin?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'actionByAdmin', referencedColumnName: 'id' })
  admin?: User;

  @Column()
  @Column({ nullable: true, length: 1000 })
  description?: string;

  @Column({ type: 'enum', enum: ScoreApprovalActionEnum })
  action!: ScoreApprovalActionEnum;

  @Column()
  idScoreApprovalMotive!: number;

  @ManyToOne(() => ScoreApprovalMotive)
  @JoinColumn()
  scoreApprovalMotive!: ScoreApprovalMotive;
}
