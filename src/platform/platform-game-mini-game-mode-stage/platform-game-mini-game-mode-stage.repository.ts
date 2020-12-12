import { EntityRepository, Repository } from 'typeorm';
import { PlatformGameMiniGameModeStage } from './platform-game-mini-game-mode-stage.entity';

@EntityRepository(PlatformGameMiniGameModeStage)
export class PlatformGameMiniGameModeStageRepository extends Repository<PlatformGameMiniGameModeStage> {
  async findIdByPlatformGameMiniGameModeStage(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number,
    idStage: number
  ): Promise<number> {
    return (
      await this.createQueryBuilder('pgmms')
        .innerJoin('pgmms.platformGameMiniGameMode', 'pgmm')
        .innerJoin('pgmm.platformGameMiniGame', 'pgm')
        .innerJoin('pgm.gameMiniGame', 'gm')
        .andWhere('pgm.idPlatform = :idPlatform', { idPlatform })
        .andWhere('gm.idGame = :idGame', { idGame })
        .andWhere('gm.idMiniGame = :idMiniGame', { idMiniGame })
        .andWhere('pgmm.idMode = :idMode', { idMode })
        .andWhere('pgmms.idStage = :idStage', { idStage })
        .select('pgmms.id')
        .getOneOrFail()
    ).id;
  }
}
