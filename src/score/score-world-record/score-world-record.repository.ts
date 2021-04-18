import { EntityRepository, Repository } from 'typeorm';
import { ScoreWorldRecord } from './score-world-record.entity';
import { ScoreWorldRecordTypeEnum } from './score-world-record-type.enum';
import { ScoreWorldRecordHistoryDto } from './score-world-record.dto';
import { endOfDay, startOfDay } from 'date-fns';

@EntityRepository(ScoreWorldRecord)
export class ScoreWorldRecordRepository extends Repository<ScoreWorldRecord> {
  async findCharacterWorldRecordByIdPlatformGameMiniGameModeStageAndCharacterCostume(
    idPlatformGameMiniGameModeStage: number,
    idPlatformGameMiniGameModeCharacterCostume: number
  ): Promise<ScoreWorldRecord | undefined> {
    return this.createQueryBuilder('s')
      .innerJoin('s.scoreWorldRecordCharacters', 'c')
      .andWhere('s.idPlatformGameMiniGameModeStage = :idPlatformGameMiniGameModeStage', {
        idPlatformGameMiniGameModeStage,
      })
      .andWhere('s.type = :type', { type: ScoreWorldRecordTypeEnum.CharacterWorldRecord })
      .andWhere('c.idPlatformGameMiniGameModeCharacterCostume = :idPlatformGameMiniGameModeCharacterCostume', {
        idPlatformGameMiniGameModeCharacterCostume,
      })
      .andWhere('s.endDate is null')
      .getOne();
  }

  async findCombinationWordRecordByIdPlatformGameMiniGameModeStageAndCharacterCostumes(
    idPlatformGameMiniGameModeStage: number,
    idPlatformGameMiniGameModeCharacterCostumes: number[]
  ): Promise<ScoreWorldRecord | undefined> {
    const qb = this.createQueryBuilder('s')
      .andWhere('s.idPlatformGameMiniGameModeStage = :idPlatformGameMiniGameModeStage', {
        idPlatformGameMiniGameModeStage,
      })
      .andWhere('s.type = :type', { type: ScoreWorldRecordTypeEnum.CombinationWorldRecord })
      .andWhere('s.endDate is null');
    for (let i = 0, len = idPlatformGameMiniGameModeCharacterCostumes.length; i < len; i++) {
      const tableAlias = `c${i}`;
      const columnAlias = `${tableAlias}idPlatformGameMiniGameModeCharacterCostume`;
      const idPlatformGameMiniGameModeCharacterCostume = idPlatformGameMiniGameModeCharacterCostumes[i];
      qb.innerJoin('s.scoreWorldRecordCharacters', tableAlias).andWhere(
        `${tableAlias}.idPlatformGameMiniGameModeCharacterCostume = :${columnAlias}`,
        {
          [columnAlias]: idPlatformGameMiniGameModeCharacterCostume,
        }
      );
      for (let j = 0; j < len; j++) {
        if (i !== j) {
          const tableAlias2 = `c${j}`;
          qb.andWhere(`${tableAlias2}.id != ${tableAlias}.id`);
        }
      }
    }
    return qb.getOne();
  }

  async findHistory({
    idPlatform,
    idGame,
    idMiniGame,
    idMode,
    idStage,
    idCharacterCostume,
    fromDate,
    toDate,
    type,
  }: ScoreWorldRecordHistoryDto): Promise<ScoreWorldRecord[]> {
    const queryBuilder = this.createQueryBuilder('swr')
      .innerJoin('swr.platformGameMiniGameModeStage', 'pgmgms')
      .andWhere('pgmgms.idStage = :idStage', { idStage })
      .innerJoin('pgmgms.platformGameMiniGameMode', 'pgmgm')
      .andWhere('pgmgm.idMode = :idMode', { idMode })
      .innerJoin('pgmgm.platformGameMiniGame', 'pgmg')
      .andWhere('pgmg.idPlatform = :idPlatform', { idPlatform })
      .innerJoin('pgmg.gameMiniGame', 'gmg')
      .andWhere('gmg.idGame = :idGame', { idGame })
      .andWhere('gmg.idMiniGame = :idMiniGame', { idMiniGame })
      .andWhere('swr.type = :type', { type })
      .addOrderBy('swr.type');
    if (idCharacterCostume) {
      queryBuilder
        .innerJoin('swr.scoreWorldRecordCharacters', 'swrc')
        .innerJoin('swrc.platformGameMiniGameModeCharacterCostume', 'pgmgmcc')
        .innerJoin('pgmgmcc.characterCostume', 'cc')
        .andWhere('cc.id = :idCharacterCostume', { idCharacterCostume })
        .addOrderBy('cc.id');
    }
    if (fromDate) {
      queryBuilder.andWhere('coalesce(swr.endDate, now()) >= :fromDate', { fromDate: startOfDay(fromDate) });
    }
    if (toDate) {
      queryBuilder.andWhere('coalesce(swr.endDate, now()) <= :toDate', { toDate: endOfDay(toDate) });
    }
    return queryBuilder.addOrderBy('swr.endDate', 'DESC').getMany();
  }
}
