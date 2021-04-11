import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';

@Entity()
export class Platform extends BaseEntity {
  @Column()
  @Index()
  name!: string;

  @Column({ length: 10 })
  @Index()
  shortName!: string;
}
