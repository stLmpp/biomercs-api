import { Injectable } from '@nestjs/common';
import { ScorePlayer } from './score-player.entity';
import { ScorePlayerAddDto, ScorePlayerUpdateDto } from './score-player.dto';
import { ScorePlayerRepository } from './score-player.repository';
import { PlatformGameMiniGameModeCharacterCostumeService } from '../../platform/platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.service';

@Injectable()
export class ScorePlayerService {
  constructor(
    private scorePlayerRepository: ScorePlayerRepository,
    private platformGameMiniGameModeCharacterCostumeService: PlatformGameMiniGameModeCharacterCostumeService
  ) {}

  async addMany(
    idScore: number,
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number,
    dto: ScorePlayerAddDto[]
  ): Promise<ScorePlayer[]> {
    const scorePlayersDto = await Promise.all(
      dto.map(async ({ idCharacterCostume, ...scorePlayer }) => {
        const idPlatformGameMiniGameModeCharacterCostume = await this.platformGameMiniGameModeCharacterCostumeService.findIdByPlaformGameMiniGameModeCharacterCostume(
          idPlatform,
          idGame,
          idMiniGame,
          idMode,
          idCharacterCostume
        );
        return new ScorePlayer().extendDto({ ...scorePlayer, idScore, idPlatformGameMiniGameModeCharacterCostume });
      })
    );
    return this.scorePlayerRepository.save(scorePlayersDto);
  }

  // TODO REMOVE
  async addManyRandom(scorePlayers: ScorePlayer[]): Promise<ScorePlayer[]> {
    return this.scorePlayerRepository.save(scorePlayers);
  }

  async findCountByIdScoreWithtoutCreator(idScore: number): Promise<number> {
    return this.scorePlayerRepository.findCountByIdScoreWithtoutCreator(idScore);
  }

  async updateMany(dto: ScorePlayerUpdateDto[]): Promise<void> {
    await this.scorePlayerRepository.save(dto);
  }

  async transferScores(oldIdPlayer: number, newIdPlayer: number): Promise<void> {
    await this.scorePlayerRepository.update({ idPlayer: oldIdPlayer }, { idPlayer: newIdPlayer });
  }
}
