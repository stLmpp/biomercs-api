import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { Score } from '../score.entity';
import { Property } from '../../mapper/property.decorator';

@Entity()
export class ScoreStatus extends BaseEntity {
  @Property()
  @Column()
  description!: string;

  @Property(() => Score)
  @OneToMany(() => Score, score => score.scoreStatus)
  scores!: Score;
}
