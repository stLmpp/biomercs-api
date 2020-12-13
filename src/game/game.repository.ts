import { EntityRepository, Repository } from 'typeorm';
import { Game } from './game.entity';

@EntityRepository(Game)
export class GameRepository extends Repository<Game> {
  async findByIdPlatform(idPlatform: number): Promise<Game[]> {
    return this.createQueryBuilder('g')
      .innerJoin('g.gameMiniGames', 'gm')
      .innerJoin('gm.platformGameMiniGames', 'gmg')
      .andWhere('gmg.idPlatform = :idPlatform', { idPlatform })
      .getMany();
  }
}
