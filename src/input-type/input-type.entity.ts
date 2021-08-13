import { BaseEntity } from '../shared/super/base-entity';
import { Column, Entity } from 'typeorm';
import { Property } from '../mapper/property.decorator';

@Entity()
export class InputType extends BaseEntity {
  @Property()
  @Column()
  name!: string
}
