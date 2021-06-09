import { ScoreStatusEnum } from './score-status/score-status.enum';
import { SelectQueryBuilder } from 'typeorm';
import { Score } from './score.entity';

export function includeScoreQueryBuilder(
  queryBuilder: SelectQueryBuilder<any>,
  idScoreStatus: ScoreStatusEnum,
  idPlayer?: number
): SelectQueryBuilder<Score> {
  queryBuilder
    .from(Score, 's')
    .andWhere('s.idScoreStatus = :idScoreStatus', { idScoreStatus })
    .innerJoin('s.platformGameMiniGameModeStage', 'spgmgms')
    .innerJoin('spgmgms.platformGameMiniGameMode', 'spgmgm')
    .innerJoin('spgmgm.platformGameMiniGame', 'spgmg')
    .innerJoin('spgmg.gameMiniGame', 'sgmg');
  if (idPlayer) {
    queryBuilder
      .andWhere('s.createdByIdPlayer != :createdByIdPlayer', { createdByIdPlayer: idPlayer })
      .innerJoin('s.scorePlayers', 'ssp')
      .andWhere('ssp.idPlayer = :idPlayer', { idPlayer });
  }
  return queryBuilder;
}
