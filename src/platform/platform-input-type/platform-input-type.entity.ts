import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { SchemaEnum } from '../../environment/schema.enum';
import { BaseEntity } from '../../shared/super/base-entity';
import { Property } from '../../mapper/property.decorator';
import { InputType } from '../../input-type/input-type.entity';
import { Platform } from '../platform.entity';
import { PlatformInputTypeInterface } from './platform-input-type.interface';

@Unique(['idInputType', 'idPlatform'])
@Entity({ schema: SchemaEnum.main })
export class PlatformInputType extends BaseEntity implements PlatformInputTypeInterface {
  @Property()
  @Column()
  idInputType!: number;

  @Property(() => InputType)
  @ManyToOne(() => InputType, inputType => inputType.platformInputTypes)
  @JoinColumn()
  inputType?: InputType;

  @Property()
  @Column()
  idPlatform!: number;

  @Property(() => Platform)
  @ManyToOne(() => Platform)
  @JoinColumn()
  platform?: Platform;
}
