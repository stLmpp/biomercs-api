import { PlatformGameMiniGameModeInterface } from './platform-game-mini-game-mode.interface';
import { Property } from '../../mapper/property.decorator';

export class PlatformGameMiniGameModeViewModel implements PlatformGameMiniGameModeInterface {
  @Property() id!: number;
  @Property() idMode!: number;
  @Property() idPlatformGameMiniGame!: number;
}
