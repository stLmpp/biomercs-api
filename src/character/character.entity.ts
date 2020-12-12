import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';

@Entity()
export class Character extends BaseEntity {
  @Column() name!: string;
}
