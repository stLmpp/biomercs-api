import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { GameMiniGame } from './game-mini-game/game-mini-game.entity';
import { Property } from '../mapper/property.decorator';
import { GameInterface } from './game.interface';
import { SchemaEnum } from '../environment/schema.enum';

@Entity({ schema: SchemaEnum.main })
export class Game extends BaseEntity implements GameInterface {
  @Property()
  @Column()
  @Index()
  name!: string;

  @Property()
  @Column({ length: 10 })
  @Index()
  shortName!: string;

  @Property(() => GameMiniGame)
  @OneToMany(() => GameMiniGame, gameMiniGame => gameMiniGame.game)
  gameMiniGames!: GameMiniGame[];
}
