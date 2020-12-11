import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';

@Entity()
export class MiniGame extends BaseEntity {
  @Column() name!: string;
}
