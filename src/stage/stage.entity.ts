import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';

@Entity()
export class Stage extends BaseEntity {
  @Column() name!: string;
  @Column({ length: 10 }) shortName!: string;
}
