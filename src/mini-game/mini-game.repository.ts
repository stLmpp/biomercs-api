import { EntityRepository, Repository } from 'typeorm';
import { MiniGame } from './mini-game.entity';
import { MiniGamePlatformsGamesDto } from './mini-game.dto';

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

  async findByIdPlatformsGames({ idPlatforms, idGames }: MiniGamePlatformsGamesDto): Promise<MiniGame[]> {
    return this.createQueryBuilder('m')
      .innerJoin('m.gameMiniGames', 'gm')
      .innerJoin('gm.platformGameMiniGames', 'gmg')
      .andWhere('gmg.idPlatform in (:...idPlatforms)', { idPlatforms })
      .andWhere('gm.idGame in (:...idGames)', { idGames })
      .getMany();
  }
}
