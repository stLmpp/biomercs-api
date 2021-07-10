import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { Score } from '../score.entity';
import { Property } from '../../mapper/property.decorator';
import { ScoreChangeRequestInterface } from './score-change-request.interface';

@Entity()
export class ScoreChangeRequest extends BaseEntity implements ScoreChangeRequestInterface {
  @Property()
  @Column()
  idScore!: number;

  @Property(() => Score)
  @ManyToOne(() => Score, score => score.scoreChangeRequests)
  @JoinColumn()
  score!: Score;

  @Property()
  @Column({ length: 1000 })
  description!: string;

  @Property()
  @Column({ nullable: true })
  dateFulfilled?: Date;
}
