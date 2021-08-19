import { Column, Entity } from 'typeorm';
import { SchemaEnum } from '../../environment/schema.enum';
import { BaseEntity } from '../../shared/super/base-entity';
import { Property } from '../../mapper/property.decorator';

@Entity({ schema: SchemaEnum.main })
export class NotificationType extends BaseEntity {
  @Property()
  @Column({ type: 'text' })
  content!: string;
}
