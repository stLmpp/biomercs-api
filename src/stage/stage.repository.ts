import { EntityRepository, Repository } from 'typeorm';
import { Stage } from './stage.entity';
import { StagePlatformsGamesMiniGamesModesDto } from './stage.dto';

@EntityRepository(Stage)
export class StageRepository extends Repository<Stage> {
  async findByIdPlatformGameMiniGameMode(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Promise<Stage[]> {
    return this.createQueryBuilder('s')
      .innerJoin('s.platformGameMiniGameModeStages', 'pgmms')
      .innerJoin('pgmms.platformGameMiniGameMode', 'pgmm')
      .innerJoin('pgmm.platformGameMiniGame', 'pgm')
      .innerJoin('pgm.gameMiniGame', 'gm')
      .andWhere('pgm.idPlatform = :idPlatform', { idPlatform })
      .andWhere('gm.idGame = :idGame', { idGame })
      .andWhere('gm.idMiniGame = :idMiniGame', { idMiniGame })
      .andWhere('pgmm.idMode = :idMode', { idMode })
      .orderBy('s.id')
      .getMany();
  }

  async findByIdPlatformsGamesMiniGamesModes({
    idPlatforms,
    idGames,
    idMiniGames,
    idModes,
  }: StagePlatformsGamesMiniGamesModesDto): Promise<Stage[]> {
    return this.createQueryBuilder('s')
      .innerJoin('s.platformGameMiniGameModeStages', 'pgmms')
      .innerJoin('pgmms.platformGameMiniGameMode', 'pgmm')
      .innerJoin('pgmm.platformGameMiniGame', 'pgm')
      .innerJoin('pgm.gameMiniGame', 'gm')
      .andWhere('pgm.idPlatform in (:...idPlatforms)', { idPlatforms })
      .andWhere('gm.idGame in (:...idGames)', { idGames })
      .andWhere('gm.idMiniGame in (:...idMiniGames)', { idMiniGames })
      .andWhere('pgmm.idMode in (:...idModes)', { idModes })
      .orderBy('s.id')
      .getMany();
  }
}
