import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { GameMiniGame } from '../game/game-mini-game/game-mini-game.entity';
import { Property } from '../mapper/property.decorator';
import { MiniGameInterface } from './mini-game.interface';
import { SchemaEnum } from '../environment/schema.enum';

@Entity({ schema: SchemaEnum.main })
export class MiniGame extends BaseEntity implements MiniGameInterface {
  @Property()
  @Column()
  @Index()
  name!: string;

  @Property(() => GameMiniGame)
  @OneToMany(() => GameMiniGame, gameMiniGame => gameMiniGame.miniGame)
  gameMiniGames!: GameMiniGame[];
}
