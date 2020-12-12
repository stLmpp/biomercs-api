import { Injectable } from '@nestjs/common';
import { PlatformGameMiniGameRepository } from './platform-game-mini-game.repository';
import { PlatformGameMiniGame } from './platform-game-mini-game.entity';
import { GameMiniGameService } from '../../game/game-mini-game/game-mini-game.service';

@Injectable()
export class PlatformGameMiniGameService {
  constructor(
    private platformGameMiniGameRepository: PlatformGameMiniGameRepository,
    private gameMiniGameService: GameMiniGameService
  ) {}

  async link(idPlatform: number, idGame: number, idMiniGame: number): Promise<PlatformGameMiniGame> {
    const idGameMiniGame = await this.gameMiniGameService.findIdByGameMiniGame(idGame, idMiniGame);
    return this.platformGameMiniGameRepository.save(
      new PlatformGameMiniGame().extendDto({ idGameMiniGame, idPlatform })
    );
  }

  async unlink(idPlatform: number, idGame: number, idMiniGame: number): Promise<void> {
    const idPlatformGameMiniGame = await this.findIdByPlatformGameMiniGame(idPlatform, idGame, idMiniGame);
    await this.platformGameMiniGameRepository.delete(idPlatformGameMiniGame);
  }

  async findIdByPlatformGameMiniGame(idPlatform: number, idGame: number, idMiniGame: number): Promise<number> {
    return this.platformGameMiniGameRepository.findIdByPlatformGameMiniGame(idPlatform, idGame, idMiniGame);
  }
}
