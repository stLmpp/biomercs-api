import { EntityRepository, Repository } from 'typeorm';
import { Mode } from './mode.entity';
import { ModePlatformsGamesMiniGamesDto } from './mode.dto';

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
}
