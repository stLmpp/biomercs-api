import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { Property } from '../mapper/property.decorator';

@Entity()
export class Region extends BaseEntity {
  @Property()
  @Column()
  name!: string;

  @Property()
  @Column({ length: 10 })
  shortName!: string;
}
