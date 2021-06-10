import { EntityRepository, Repository } from 'typeorm';
import { Game } from './game.entity';
import { GamePlatformsDto } from './game.dto';
import { includeScoreQueryBuilder } from '../score/shared';
import { ScoreStatusEnum } from '../score/score-status/score-status.enum';

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

  async findApprovalByIdPlatform(
    idScoreStatus: ScoreStatusEnum,
    idPlatform: number,
    idPlayer?: number
  ): Promise<Game[]> {
    return this.createQueryBuilder('g')
      .innerJoin('g.gameMiniGames', 'gm')
      .innerJoin('gm.platformGameMiniGames', 'gmg')
      .andWhere('gmg.idPlatform = :idPlatform', { idPlatform })
      .orderBy('g.id')
      .andExists(subQuery =>
        includeScoreQueryBuilder(subQuery, idScoreStatus, idPlayer)
          .andWhere('sgmg.idGame = g.id')
          .andWhere('spgmg.idPlatform = :idPlatform', { idPlatform })
      )
      .getMany();
  }
}
