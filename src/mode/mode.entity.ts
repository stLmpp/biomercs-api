import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { PlatformGameMiniGameMode } from '../platform/platform-game-mini-game-mode/platform-game-mini-game-mode.entity';

@Entity()
export class Mode extends BaseEntity {
  @Column() name!: string;
  @Column() playerQuantity!: number;

  @OneToMany(() => PlatformGameMiniGameMode, platformGameMiniGameMode => platformGameMiniGameMode.mode)
  platformGameMiniGameModes!: PlatformGameMiniGameMode[];
}
