import { GameMiniGameInterface } from './game-mini-game.interface';
import { Property } from '../../mapper/property.decorator';

export class GameMiniGameViewModel implements GameMiniGameInterface {
  @Property() id!: number;
  @Property() idGame!: number;
  @Property() idMiniGame!: number;
}
