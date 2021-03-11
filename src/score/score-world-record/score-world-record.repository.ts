import { EntityRepository, Repository } from 'typeorm';
import { ScoreWorldRecord } from './score-world-record.entity';
import { ScoreWorldRecordTypeEnum } from './score-world-record-type.enum';

@EntityRepository(ScoreWorldRecord)
export class ScoreWorldRecordRepository extends Repository<ScoreWorldRecord> {
  async updateEndDateCharacterWorldRecordByIdPlatformGameMiniGameModeStageAndCharacterCostume(
    idPlatformGameMiniGameModeStage: number,
    idPlatformGameMiniGameModeCharacterCostume: number,
    fromDate: Date
  ): Promise<void> {
    const scoreWorldRecord = await this.createQueryBuilder('s')
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
    if (scoreWorldRecord) {
      await this.update(scoreWorldRecord.id, { endDate: fromDate });
    }
  }

  async updateEndDateCombinationWordRecordByIdPlatformGameMiniGameModeStageAndCharacterCostumes(
    idPlatformGameMiniGameModeStage: number,
    idPlatformGameMiniGameModeCharacterCostumes: number[],
    fromDate: Date
  ): Promise<void> {
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
    const scoreWorldRecord = await qb.getOne();
    if (scoreWorldRecord) {
      await this.update(scoreWorldRecord.id, { endDate: fromDate });
    }
  }
}
