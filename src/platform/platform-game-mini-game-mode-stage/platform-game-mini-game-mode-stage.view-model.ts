import { PlatformGameMiniGameModeStageInterface } from './platform-game-mini-game-mode-stage.interface';
import { Property } from '../../mapper/property.decorator';

export class PlatformGameMiniGameModeStageViewModel implements PlatformGameMiniGameModeStageInterface {
  @Property() id!: number;
  @Property() idPlatformGameMiniGameMode!: number;
  @Property() idStage!: number;
}
