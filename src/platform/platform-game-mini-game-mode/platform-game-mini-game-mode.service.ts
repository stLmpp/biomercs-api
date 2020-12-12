import { Injectable } from '@nestjs/common';
import { PlatformGameMiniGameModeRepository } from './platform-game-mini-game-mode.repository';
import { PlatformGameMiniGameService } from '../platform-game-mini-game/platform-game-mini-game.service';
import { PlatformGameMiniGameMode } from './platform-game-mini-game-mode.entity';

@Injectable()
export class PlatformGameMiniGameModeService {
  constructor(
    private platformGameMiniGameModeRepository: PlatformGameMiniGameModeRepository,
    private platformGameMiniGameService: PlatformGameMiniGameService
  ) {}

  async link(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Promise<PlatformGameMiniGameMode> {
    const idPlatformGameMiniGame = await this.platformGameMiniGameService.findIdByPlatformGameMiniGame(
      idPlatform,
      idGame,
      idMiniGame
    );
    return this.platformGameMiniGameModeRepository.save(
      new PlatformGameMiniGameMode().extendDto({ idMode, idPlatformGameMiniGame })
    );
  }

  async unlink(idPlatform: number, idGame: number, idMiniGame: number, idMode: number): Promise<void> {
    const idPlatformGameMiniGameMode = await this.findIdByPlaformGameMiniGameMode(
      idPlatform,
      idGame,
      idMiniGame,
      idMode
    );
    await this.platformGameMiniGameModeRepository.delete(idPlatformGameMiniGameMode);
  }

  async findIdByPlaformGameMiniGameMode(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Promise<number> {
    return this.platformGameMiniGameModeRepository.findIdByPlaformGameMiniGameMode(
      idPlatform,
      idGame,
      idMiniGame,
      idMode
    );
  }
}
