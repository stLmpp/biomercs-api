import { EntityRepository, Repository } from 'typeorm';
import { Game } from './game.entity';
import { GamePlatformsDto } from './game.dto';

@EntityRepository(Game)
export class GameRepository extends Repository<Game> {
  async findByIdPlatform(idPlatform: number): Promise<Game[]> {
    return this.createQueryBuilder('g')
      .innerJoin('g.gameMiniGames', 'gm')
      .innerJoin('gm.platformGameMiniGames', 'gmg')
      .andWhere('gmg.idPlatform = :idPlatform', { idPlatform })
      .orderBy('g.id')
      .getMany();
  }

  async findByIdPlatforms({ idPlatforms }: GamePlatformsDto): Promise<Game[]> {
    return this.createQueryBuilder('g')
      .innerJoin('g.gameMiniGames', 'gm')
      .innerJoin('gm.platformGameMiniGames', 'pgmg')
      .andWhere('pgmg.idPlatform in (:...idPlatforms)', { idPlatforms })
      .orderBy('g.id')
      .getMany();
  }
}
