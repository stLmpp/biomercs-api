import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { Property } from '../mapper/property.decorator';
import { RegionInterface } from './region.interface';
import { SchemaEnum } from '../environment/schema.enum';

@Entity({ schema: SchemaEnum.main })
export class Region extends BaseEntity implements RegionInterface {
  @Property()
  @Column()
  name!: string;

  @Property()
  @Column({ length: 10 })
  shortName!: string;
}
