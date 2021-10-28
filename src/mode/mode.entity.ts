import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { PlatformGameMiniGameMode } from '../platform/platform-game-mini-game-mode/platform-game-mini-game-mode.entity';
import { Property } from '../mapper/property.decorator';
import { ModeInterface } from './mode.interface';
import { SchemaEnum } from '../environment/schema.enum';

@Entity({ schema: SchemaEnum.main })
export class Mode extends BaseEntity implements ModeInterface {
  @Property()
  @Column()
  @Index()
  name!: string;

  @Property()
  @Column()
  playerQuantity!: number;

  @Property(() => PlatformGameMiniGameMode)
  @OneToMany(() => PlatformGameMiniGameMode, platformGameMiniGameMode => platformGameMiniGameMode.mode)
  platformGameMiniGameModes!: PlatformGameMiniGameMode[];
}
