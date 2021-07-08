import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { PlatformGameMiniGameMode } from '../platform/platform-game-mini-game-mode/platform-game-mini-game-mode.entity';
import { Property } from '../mapper/property.decorator';
import { ModeInterface } from './mode.interface';

@Entity()
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
