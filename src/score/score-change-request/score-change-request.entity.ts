import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { Score } from '../score.entity';

@Entity()
export class ScoreChangeRequest extends BaseEntity {
  @Column()
  idScore!: number;

  @ManyToOne(() => Score, score => score.scoreChangeRequests)
  @JoinColumn()
  score!: Score;

  @Column({ length: 1000 })
  description!: string;

  @Column({ nullable: true })
  dateFulfilled?: Date;
}
