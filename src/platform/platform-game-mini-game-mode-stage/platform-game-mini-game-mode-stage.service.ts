import { Injectable } from '@nestjs/common';
import { PlatformGameMiniGameModeStageRepository } from './platform-game-mini-game-mode-stage.repository';
import { PlatformGameMiniGameModeService } from '../platform-game-mini-game-mode/platform-game-mini-game-mode.service';
import { PlatformGameMiniGameModeStage } from './platform-game-mini-game-mode-stage.entity';

@Injectable()
export class PlatformGameMiniGameModeStageService {
  constructor(
    private platformGameMiniGameModeStageRepository: PlatformGameMiniGameModeStageRepository,
    private platformGameMiniGameModeService: PlatformGameMiniGameModeService
  ) {}

  async link(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number,
    idStage: number
  ): Promise<PlatformGameMiniGameModeStage> {
    const idPlatformGameMiniGameMode = await this.platformGameMiniGameModeService.findIdByPlatformGameMiniGameMode(
      idPlatform,
      idGame,
      idMiniGame,
      idMode
    );
    return this.platformGameMiniGameModeStageRepository.save(
      new PlatformGameMiniGameModeStage().extendDto({ idPlatformGameMiniGameMode, idStage })
    );
  }

  async unlink(idPlatform: number, idGame: number, idMiniGame: number, idMode: number, idStage: number): Promise<void> {
    const idPlatformGameMiniGameModeStage = await this.findIdByPlatformGameMiniGameModeStage(
      idPlatform,
      idGame,
      idMiniGame,
      idMode,
      idStage
    );
    await this.platformGameMiniGameModeStageRepository.delete(idPlatformGameMiniGameModeStage);
  }

  async findIdByPlatformGameMiniGameModeStage(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number,
    idStage: number
  ): Promise<number> {
    return this.platformGameMiniGameModeStageRepository.findIdByPlatformGameMiniGameModeStage(
      idPlatform,
      idGame,
      idMiniGame,
      idMode,
      idStage
    );
  }

  async findByPlatformGameMiniGameMode(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Promise<PlatformGameMiniGameModeStage[]> {
    return this.platformGameMiniGameModeStageRepository.findByPlatformGameMiniGameMode(
      idPlatform,
      idGame,
      idMiniGame,
      idMode
    );
  }
}
