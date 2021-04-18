import { Injectable } from '@nestjs/common';
import { PlatformGameMiniGameModeCharacterCostumeRepository } from './platform-game-mini-game-mode-character-costume.repository';
import { PlatformGameMiniGameModeService } from '../platform-game-mini-game-mode/platform-game-mini-game-mode.service';
import { PlatformGameMiniGameModeCharacterCostume } from './platform-game-mini-game-mode-character-costume.entity';

@Injectable()
export class PlatformGameMiniGameModeCharacterCostumeService {
  constructor(
    private platformGameMiniGameModeCharacterCostumeRepository: PlatformGameMiniGameModeCharacterCostumeRepository,
    private platformGameMiniGameModeService: PlatformGameMiniGameModeService
  ) {}

  async link(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number,
    idCharacterCostume: number
  ): Promise<PlatformGameMiniGameModeCharacterCostume> {
    const idPlatformGameMiniGameMode = await this.platformGameMiniGameModeService.findIdByPlaformGameMiniGameMode(
      idPlatform,
      idGame,
      idMiniGame,
      idMode
    );
    return this.platformGameMiniGameModeCharacterCostumeRepository.save(
      new PlatformGameMiniGameModeCharacterCostume().extendDto({ idCharacterCostume, idPlatformGameMiniGameMode })
    );
  }

  async unlink(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number,
    idCharacterCostume: number
  ): Promise<void> {
    const idPlatformGameMiniGameModeCharacterCostume = await this.findIdByPlaformGameMiniGameModeCharacterCostume(
      idPlatform,
      idGame,
      idMiniGame,
      idMode,
      idCharacterCostume
    );
    await this.platformGameMiniGameModeCharacterCostumeRepository.delete(idPlatformGameMiniGameModeCharacterCostume);
  }

  async findIdByPlaformGameMiniGameModeCharacterCostume(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number,
    idCharacterCostume: number
  ): Promise<number> {
    return this.platformGameMiniGameModeCharacterCostumeRepository.findIdByPlaformGameMiniGameModeCharacterCostume(
      idPlatform,
      idGame,
      idMiniGame,
      idMode,
      idCharacterCostume
    );
  }

  async findByPlatformGameMiniGameMode(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Promise<PlatformGameMiniGameModeCharacterCostume[]> {
    return this.platformGameMiniGameModeCharacterCostumeRepository.findByPlatformGameMiniGameMode(
      idPlatform,
      idGame,
      idMiniGame,
      idMode
    );
  }

  async findRandom(
    idPlatformGameMiniGameMode: number,
    characterCostume?: string
  ): Promise<PlatformGameMiniGameModeCharacterCostume> {
    const qb = this.platformGameMiniGameModeCharacterCostumeRepository
      .createQueryBuilder('pgmmcc')
      .andWhere('pgmmcc.idPlatformGameMiniGameMode = :idPlatformGameMiniGameMode', { idPlatformGameMiniGameMode })
      .orderBy('random()');
    if (characterCostume) {
      qb.innerJoin('pgmmcc.characterCostume', 'cc').andWhere('cc.shortName = :characterCostume', { characterCostume });
    }
    return qb.getOneOrFail();
  }
}
