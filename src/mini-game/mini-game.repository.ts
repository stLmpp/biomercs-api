import { EntityRepository, Repository } from 'typeorm';
import { MiniGame } from './mini-game.entity';

@EntityRepository(MiniGame)
export class MiniGameRepository extends Repository<MiniGame> {
  async findByIdPlatformGame(idPlatform: number, idGame: number): Promise<MiniGame[]> {
    return this.createQueryBuilder('m')
      .innerJoin('m.gameMiniGames', 'gm')
      .innerJoin('gm.platformGameMiniGames', 'gmg')
      .andWhere('gmg.idPlatform = :idPlatform', { idPlatform })
      .andWhere('gm.idGame = :idGame', { idGame })
      .getMany();
  }
}
