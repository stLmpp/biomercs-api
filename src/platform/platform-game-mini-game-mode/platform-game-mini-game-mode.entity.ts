import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { PlatformGameMiniGame } from '../platform-game-mini-game/platform-game-mini-game.entity';
import { Mode } from '../../mode/mode.entity';
import { PlatformGameMiniGameModeStage } from '../platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.entity';
import { Property } from '../../mapper/property.decorator';
import { PlatformGameMiniGameModeCharacterCostume } from '../platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.entity';
import { PlatformGameMiniGameModeInterface } from './platform-game-mini-game-mode.interface';
import { SchemaEnum } from '../../environment/schema.enum';

@Unique(['idPlatformGameMiniGame', 'idMode'])
@Entity({ schema: SchemaEnum.main })
export class PlatformGameMiniGameMode extends BaseEntity implements PlatformGameMiniGameModeInterface {
  @Property()
  @Column()
  idPlatformGameMiniGame!: number;

  @Property(() => PlatformGameMiniGame)
  @ManyToOne(() => PlatformGameMiniGame, platformGameMiniGame => platformGameMiniGame.platformGameMiniGameModes)
  @JoinColumn()
  platformGameMiniGame!: PlatformGameMiniGame;

  @Property()
  @Column()
  idMode!: number;

  @Property(() => Mode)
  @ManyToOne(() => Mode)
  @JoinColumn()
  mode!: Mode;

  @Property(() => PlatformGameMiniGameModeStage)
  @OneToMany(
    () => PlatformGameMiniGameModeStage,
    platformGameMiniGameModeStage => platformGameMiniGameModeStage.platformGameMiniGameMode
  )
  platformGameMiniGameModeStages!: PlatformGameMiniGameModeStage[];

  @Property(() => PlatformGameMiniGameModeCharacterCostume)
  @OneToMany(
    () => PlatformGameMiniGameModeCharacterCostume,
    platformGameMiniGameModeCharacterCostume => platformGameMiniGameModeCharacterCostume.platformGameMiniGameMode
  )
  platformGameMiniGameModeCharacterCostumes!: PlatformGameMiniGameModeCharacterCostume[];
}
