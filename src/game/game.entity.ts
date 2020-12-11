import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';

@Entity()
export class Game extends BaseEntity {
  @Column() name!: string;
  @Column({ length: 10 }) shortName!: string;
}
