import { Injectable } from '@nestjs/common';
import { ScorePlayer } from './score-player.entity';
import { ScorePlayerAddDto, ScorePlayerUpdateDto } from './score-player.dto';
import { ScorePlayerRepository } from './score-player.repository';
import { PlatformGameMiniGameModeCharacterCostumeService } from '../../platform/platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.service';
import * as normalizeUrl from 'normalize-url';

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
        const idPlatformGameMiniGameModeCharacterCostume =
          await this.platformGameMiniGameModeCharacterCostumeService.findIdByPlatformGameMiniGameModeCharacterCostume(
            idPlatform,
            idGame,
            idMiniGame,
            idMode,
            idCharacterCostume
          );
        const evidence = normalizeUrl(scorePlayer.evidence);
        return new ScorePlayer().extendDto({
          ...scorePlayer,
          idScore,
          idPlatformGameMiniGameModeCharacterCostume,
          evidence,
        });
      })
    );
    return this.scorePlayerRepository.save(scorePlayersDto);
  }

  async updateMany(dtos: ScorePlayerUpdateDto[]): Promise<void> {
    await this.scorePlayerRepository.save(
      dtos.map(dto => {
        if (dto.evidence) {
          dto.evidence = normalizeUrl(dto.evidence);
        }
        return dto;
      })
    );
  }

  async transferScores(oldIdPlayer: number, newIdPlayer: number): Promise<void> {
    await this.scorePlayerRepository.update({ idPlayer: oldIdPlayer }, { idPlayer: newIdPlayer });
  }
}
