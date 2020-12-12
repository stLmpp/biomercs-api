import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';

@Entity()
export class Mode extends BaseEntity {
  @Column() name!: string;
  @Column() playerQuantity!: number;
}
