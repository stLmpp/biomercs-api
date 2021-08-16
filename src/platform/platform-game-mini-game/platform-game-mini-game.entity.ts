import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { Platform } from '../platform.entity';
import { GameMiniGame } from '../../game/game-mini-game/game-mini-game.entity';
import { Property } from '../../mapper/property.decorator';
import { PlatformGameMiniGameMode } from '../platform-game-mini-game-mode/platform-game-mini-game-mode.entity';
import { PlatformGameMiniGameInterface } from './platform-game-mini-game.interface';
import { SchemaEnum } from '../../environment/schema.enum';

@Unique(['idPlatform', 'idGameMiniGame'])
@Entity({ schema: SchemaEnum.main })
export class PlatformGameMiniGame extends BaseEntity implements PlatformGameMiniGameInterface {
  @Property()
  @Column()
  idPlatform!: number;

  @Property(() => Platform)
  @ManyToOne(() => Platform, platform => platform.platformGameMiniGames)
  @JoinColumn()
  platform!: Platform;

  @Property()
  @Column()
  idGameMiniGame!: number;

  @Property(() => GameMiniGame)
  @ManyToOne(() => GameMiniGame, gameMiniGame => gameMiniGame.platformGameMiniGames)
  @JoinColumn()
  gameMiniGame!: GameMiniGame;

  @Property(() => PlatformGameMiniGameMode)
  @OneToMany(() => PlatformGameMiniGameMode, platformGameMiniGameMode => platformGameMiniGameMode.platformGameMiniGame)
  platformGameMiniGameModes!: PlatformGameMiniGameMode[];
}
