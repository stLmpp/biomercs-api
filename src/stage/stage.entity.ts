import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { PlatformGameMiniGameModeStage } from '../platform/platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.entity';
import { Property } from '../mapper/property.decorator';

@Entity()
export class Stage extends BaseEntity {
  @Property()
  @Column()
  @Index()
  name!: string;

  @Property()
  @Column({ length: 10 })
  @Index()
  shortName!: string;

  @Property(() => PlatformGameMiniGameModeStage)
  @OneToMany(() => PlatformGameMiniGameModeStage, platformGameMiniGameModeStage => platformGameMiniGameModeStage.stage)
  platformGameMiniGameModeStages!: PlatformGameMiniGameModeStage[];
}
