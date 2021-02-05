import { Injectable } from '@nestjs/common';
import { GameMiniGameRepository } from './game-mini-game.repository';
import { GameMiniGame } from './game-mini-game.entity';

@Injectable()
export class GameMiniGameService {
  constructor(private gameMiniGameRepository: GameMiniGameRepository) {}

  async link(idGame: number, idMiniGame: number): Promise<GameMiniGame> {
    return this.gameMiniGameRepository.save(new GameMiniGame().extendDto({ idGame, idMiniGame }));
  }

  async unlink(idGame: number, idMiniGame: number): Promise<void> {
    await this.gameMiniGameRepository.delete({ idGame, idMiniGame });
  }

  async findIdByGameMiniGame(idGame: number, idMiniGame: number): Promise<number> {
    return this.gameMiniGameRepository
      .findOneOrFail({ select: ['id'], where: { idGame, idMiniGame } })
      .then(gameMiniGame => gameMiniGame.id);
  }
}
