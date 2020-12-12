import { EntityRepository, Repository } from 'typeorm';
import { PlatformGameMiniGameModeCharacter } from './platform-game-mini-game-mode-character.entity';

@EntityRepository(PlatformGameMiniGameModeCharacter)
export class PlatformGameMiniGameModeCharacterRepository extends Repository<PlatformGameMiniGameModeCharacter> {}
