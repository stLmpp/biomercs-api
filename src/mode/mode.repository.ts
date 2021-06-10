import { EntityRepository, Repository } from 'typeorm';
import { Mode } from './mode.entity';
import { ModePlatformsGamesMiniGamesDto } from './mode.dto';
import { ScoreStatusEnum } from '../score/score-status/score-status.enum';
import { includeScoreQueryBuilder } from '../score/shared';

@EntityRepository(Mode)
export class ModeRepository extends Repository<Mode> {
  async findByIdPlatformGameMiniGame(idPlatform: number, idGame: number, idMiniGame: number): Promise<Mode[]> {
    return this.createQueryBuilder('m')
      .innerJoin('m.platformGameMiniGameModes', 'pgmm')
      .innerJoin('pgmm.platformGameMiniGame', 'pgm')
      .innerJoin('pgm.gameMiniGame', 'gm')
      .andWhere('pgm.idPlatform = :idPlatform', { idPlatform })
      .andWhere('gm.idGame = :idGame', { idGame })
      .andWhere('gm.idMiniGame = :idMiniGame', { idMiniGame })
      .orderBy('m.id')
      .getMany();
  }

  async findByIdPlatformsGamesMiniGames({
    idPlatforms,
    idGames,
    idMiniGames,
  }: ModePlatformsGamesMiniGamesDto): Promise<Mode[]> {
    return this.createQueryBuilder('m')
      .innerJoin('m.platformGameMiniGameModes', 'pgmm')
      .innerJoin('pgmm.platformGameMiniGame', 'pgm')
      .innerJoin('pgm.gameMiniGame', 'gm')
      .andWhere('pgm.idPlatform in (:...idPlatforms)', { idPlatforms })
      .andWhere('gm.idGame in (:...idGames)', { idGames })
      .andWhere('gm.idMiniGame in (:...idMiniGames)', { idMiniGames })
      .orderBy('m.id')
      .getMany();
  }

  async findByIdPlatformGameMiniGameModeStage(idPlatformGameMiniGameModeStage: number): Promise<Mode | undefined> {
    return this.createQueryBuilder('m')
      .innerJoin('m.platformGameMiniGameModes', 'pgmgm')
      .innerJoin('pgmgm.platformGameMiniGameModeStages', 'pgmgms')
      .andWhere('pgmgms.id = :idPlatformGameMiniGameModeStage', {
        idPlatformGameMiniGameModeStage,
      })
      .getOneOrFail();
  }

  async findApprovalByIdPlatformGameMiniGame(
    idScoreStatus: ScoreStatusEnum,
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idPlayer?: number
  ): Promise<Mode[]> {
    return this.createQueryBuilder('m')
      .innerJoin('m.platformGameMiniGameModes', 'pgmm')
      .innerJoin('pgmm.platformGameMiniGame', 'pgm')
      .innerJoin('pgm.gameMiniGame', 'gm')
      .andWhere('pgm.idPlatform = :idPlatform', { idPlatform })
      .andWhere('gm.idGame = :idGame', { idGame })
      .andWhere('gm.idMiniGame = :idMiniGame', { idMiniGame })
      .orderBy('m.id')
      .andExists(subQuery =>
        includeScoreQueryBuilder(subQuery, idScoreStatus, idPlayer)
          .andWhere('spgmg.idPlatform = :idPlatform', {
            idPlatform,
          })
          .andWhere('sgmg.idGame = :idGame', { idGame })
          .andWhere('sgmg.idMiniGame = :idMiniGame', { idMiniGame })
          .andWhere('spgmgm.idMode = m.id')
      )
      .getMany();
  }
}
