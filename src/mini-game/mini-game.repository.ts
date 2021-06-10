import { EntityRepository, Repository } from 'typeorm';
import { MiniGame } from './mini-game.entity';
import { MiniGamePlatformsGamesDto } from './mini-game.dto';
import { ScoreStatusEnum } from '../score/score-status/score-status.enum';
import { includeScoreQueryBuilder } from '../score/shared';

@EntityRepository(MiniGame)
export class MiniGameRepository extends Repository<MiniGame> {
  async findByIdPlatformGame(idPlatform: number, idGame: number): Promise<MiniGame[]> {
    return this.createQueryBuilder('m')
      .innerJoin('m.gameMiniGames', 'gm')
      .innerJoin('gm.platformGameMiniGames', 'gmg')
      .andWhere('gmg.idPlatform = :idPlatform', { idPlatform })
      .andWhere('gm.idGame = :idGame', { idGame })
      .orderBy('m.id')
      .getMany();
  }

  async findByIdPlatformsGames({ idPlatforms, idGames }: MiniGamePlatformsGamesDto): Promise<MiniGame[]> {
    return this.createQueryBuilder('m')
      .innerJoin('m.gameMiniGames', 'gm')
      .innerJoin('gm.platformGameMiniGames', 'gmg')
      .andWhere('gmg.idPlatform in (:...idPlatforms)', { idPlatforms })
      .andWhere('gm.idGame in (:...idGames)', { idGames })
      .orderBy('m.id')
      .getMany();
  }

  async findApprovalByIdPlatformGame(
    idScoreStatus: ScoreStatusEnum,
    idPlatform: number,
    idGame: number,
    idPlayer?: number
  ): Promise<MiniGame[]> {
    return this.createQueryBuilder('m')
      .innerJoin('m.gameMiniGames', 'gm')
      .innerJoin('gm.platformGameMiniGames', 'gmg')
      .andWhere('gmg.idPlatform = :idPlatform', { idPlatform })
      .andWhere('gm.idGame = :idGame', { idGame })
      .orderBy('m.id')
      .andExists(subQuery =>
        includeScoreQueryBuilder(subQuery, idScoreStatus, idPlayer)
          .andWhere('spgmg.idPlatform = :idPlatform', {
            idPlatform,
          })
          .andWhere('sgmg.idGame = :idGame', { idGame })
          .andWhere('sgmg.idMiniGame = m.id')
      )
      .getMany();
  }
}
