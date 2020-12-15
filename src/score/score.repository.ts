import { EntityRepository, Repository } from 'typeorm';
import { Score } from './score.entity';

@EntityRepository(Score)
export class ScoreRepository extends Repository<Score> {
  async findByIdWithAllRelations(idScore: number): Promise<Score> {
    return this.findOneOrFail(idScore, {
      relations: [
        'platformGameMiniGameModeStage',
        'platformGameMiniGameModeStage.stage',
        'platformGameMiniGameModeStage.platformGameMiniGameMode',
        'platformGameMiniGameModeStage.platformGameMiniGameMode.mode',
        'platformGameMiniGameModeStage.platformGameMiniGameMode.platformGameMiniGame',
        'platformGameMiniGameModeStage.platformGameMiniGameMode.platformGameMiniGame.gameMiniGame',
        'platformGameMiniGameModeStage.platformGameMiniGameMode.platformGameMiniGame.gameMiniGame.game',
        'platformGameMiniGameModeStage.platformGameMiniGameMode.platformGameMiniGame.gameMiniGame.miniGame',
        'platformGameMiniGameModeStage.platformGameMiniGameMode.platformGameMiniGame.platform',
        'scorePlayers',
        'scorePlayers.platformGameMiniGameModeCharacterCostume',
        'scorePlayers.platformGameMiniGameModeCharacterCostume.characterCostume',
        'scorePlayers.platformGameMiniGameModeCharacterCostume.characterCostume.character',
        'scorePlayers.player',
      ],
    });
  }
}
