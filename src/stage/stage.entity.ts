import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { PlatformGameMiniGameModeStage } from '../platform/platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.entity';

@Entity()
export class Stage extends BaseEntity {
  @Column() name!: string;
  @Column({ length: 10 }) shortName!: string;

  @OneToMany(() => PlatformGameMiniGameModeStage, platformGameMiniGameModeStage => platformGameMiniGameModeStage.stage)
  platformGameMiniGameModeStages!: PlatformGameMiniGameModeStage[];
}
