import { PlatformGameMiniGameInterface } from './platform-game-mini-game.interface';
import { Property } from '../../mapper/property.decorator';

export class PlatformGameMiniGameViewModel implements PlatformGameMiniGameInterface {
  @Property() id!: number;
  @Property() idGameMiniGame!: number;
  @Property() idPlatform!: number;
}
