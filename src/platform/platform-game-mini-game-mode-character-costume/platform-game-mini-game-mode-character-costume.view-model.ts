import { PlatformGameMiniGameModeCharacterCostumeInterface } from './platform-game-mini-game-mode-character-costume.interface';
import { Property } from '../../mapper/property.decorator';

export class PlatformGameMiniGameModeCharacterCostumeViewModel
  implements PlatformGameMiniGameModeCharacterCostumeInterface
{
  @Property() id!: number;
  @Property() idCharacterCostume!: number;
  @Property() idPlatformGameMiniGameMode!: number;
}
