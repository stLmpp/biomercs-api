import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { PlatformGameMiniGame } from '../platform-game-mini-game/platform-game-mini-game.entity';
import { Mode } from '../../mode/mode.entity';

@Entity()
export class PlatformGameMiniGameMode extends BaseEntity {
  @Column()
  idPlatformGameMiniGame!: number;

  @ManyToOne(() => PlatformGameMiniGame)
  @JoinColumn()
  platformGameMiniGame!: PlatformGameMiniGame;

  @Column()
  idMode!: number;

  @ManyToOne(() => Mode)
  @JoinColumn()
  mode!: Mode;
}
