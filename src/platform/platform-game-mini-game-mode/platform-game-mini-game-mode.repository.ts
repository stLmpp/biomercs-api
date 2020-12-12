import { EntityRepository, Repository } from 'typeorm';
import { PlatformGameMiniGameMode } from './platform-game-mini-game-mode.entity';

@EntityRepository(PlatformGameMiniGameMode)
export class PlatformGameMiniGameModeRepository extends Repository<PlatformGameMiniGameMode> {}
