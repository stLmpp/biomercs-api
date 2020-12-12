import { EntityRepository, Repository } from 'typeorm';
import { PlatformGameMiniGame } from './platform-game-mini-game.entity';

@EntityRepository(PlatformGameMiniGame)
export class PlatformGameMiniGameRepository extends Repository<PlatformGameMiniGame> {
  async findIdByPlatformGameMiniGame(idPlatform: number, idGame: number, idMiniGame: number): Promise<number> {
    return (
      await this.createQueryBuilder('pgm')
        .innerJoin('pgm.gameMiniGame', 'gm')
        .select('pgm.id')
        .andWhere('pgm.idPlatform = :idPlatform', { idPlatform })
        .andWhere('gm.idGame = :idGame', { idGame })
        .andWhere('gm.idMiniGame = :idMiniGame', { idMiniGame })
        .getOneOrFail()
    ).id;
  }
}
