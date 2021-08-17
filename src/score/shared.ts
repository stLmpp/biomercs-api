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

const formatter = new Intl.NumberFormat('pt-BR');

export function formatScore(value: number): string {
  if (value <= 0) {
    return '0';
  }
  if (value < 1000) {
    return formatter.format(value);
  }
  return formatter.format(Math.floor(value / 1000)) + 'k';
}
