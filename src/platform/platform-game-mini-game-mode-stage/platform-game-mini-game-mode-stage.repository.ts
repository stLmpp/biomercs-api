import { EntityRepository, Repository } from 'typeorm';
import { PlatformGameMiniGameModeStage } from './platform-game-mini-game-mode-stage.entity';

@EntityRepository(PlatformGameMiniGameModeStage)
export class PlatformGameMiniGameModeStageRepository extends Repository<PlatformGameMiniGameModeStage> {}
