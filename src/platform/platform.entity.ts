import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { Property } from '../mapper/property.decorator';

@Entity()
export class Platform extends BaseEntity {
  @Property()
  @Column()
  @Index()
  name!: string;

  @Property()
  @Column({ length: 10 })
  @Index()
  shortName!: string;
}
