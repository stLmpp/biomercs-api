import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { PlatformGameMiniGameModeStage } from './platform-game-mini-game-mode-stage.entity';

@EntityRepository(PlatformGameMiniGameModeStage)
export class PlatformGameMiniGameModeStageRepository extends Repository<PlatformGameMiniGameModeStage> {
  private _createQueryBuilderRelations(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): SelectQueryBuilder<PlatformGameMiniGameModeStage> {
    return this.createQueryBuilder('pgmms')
      .innerJoin('pgmms.platformGameMiniGameMode', 'pgmm')
      .innerJoin('pgmm.platformGameMiniGame', 'pgm')
      .innerJoin('pgm.gameMiniGame', 'gm')
      .andWhere('pgm.idPlatform = :idPlatform', { idPlatform })
      .andWhere('gm.idGame = :idGame', { idGame })
      .andWhere('gm.idMiniGame = :idMiniGame', { idMiniGame })
      .andWhere('pgmm.idMode = :idMode', { idMode });
  }
  private _createQueryBuilderRelationsWithStage(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number,
    idStage: number
  ): SelectQueryBuilder<PlatformGameMiniGameModeStage> {
    return this._createQueryBuilderRelations(idPlatform, idGame, idMiniGame, idMode).andWhere(
      'pgmms.idStage = :idStage',
      { idStage }
    );
  }

  async findIdByPlatformGameMiniGameModeStage(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number,
    idStage: number
  ): Promise<number> {
    return (
      await this._createQueryBuilderRelationsWithStage(idPlatform, idGame, idMiniGame, idMode, idStage)
        .select('pgmms.id')
        .getOneOrFail()
    ).id;
  }

  async findByPlatformGameMiniGameMode(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Promise<PlatformGameMiniGameModeStage[]> {
    return this._createQueryBuilderRelations(idPlatform, idGame, idMiniGame, idMode)
      .innerJoinAndSelect('pgmms.stage', 's')
      .getMany();
  }
}
