import { BaseEntity } from '../shared/super/base-entity';
import { Column, Entity } from 'typeorm';
import { Property } from '../mapper/property.decorator';
import { SchemaEnum } from '../environment/schema.enum';

@Entity({ schema: SchemaEnum.main })
export class InputType extends BaseEntity {
  @Property()
  @Column()
  name!: string;
}
