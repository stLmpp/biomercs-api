import { BaseEntity } from '../shared/super/base-entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Property } from '../mapper/property.decorator';
import { SchemaEnum } from '../environment/schema.enum';
import { Player } from '../player/player.entity';
import { InputTypeInterface } from './input-type.interface';
import { PlatformInputType } from '../platform/platform-input-type/platform-input-type.entity';

@Entity({ schema: SchemaEnum.main })
export class InputType extends BaseEntity implements InputTypeInterface {
  @Property()
  @Column()
  name!: string;

  @Property(() => Player)
  @OneToMany(() => Player, player => player.inputType, { nullable: true })
  players?: Player[];

  @Property(() => PlatformInputType)
  @OneToMany(() => PlatformInputType, platformInputType => platformInputType.inputType)
  platformInputTypes?: PlatformInputType[];
}
