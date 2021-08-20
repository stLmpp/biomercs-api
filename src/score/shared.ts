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

export function includeAllScoresRelations<T>(
  queryBuilder: SelectQueryBuilder<T>,
  leftJoin = false
): SelectQueryBuilder<T> {
  const method: keyof Pick<SelectQueryBuilder<any>, 'innerJoinAndSelect' | 'leftJoinAndSelect'> = leftJoin
    ? 'leftJoinAndSelect'
    : 'innerJoinAndSelect';
  return queryBuilder[method]('score.scoreStatus', 'ss')
    [method]('score.platformGameMiniGameModeStage', 'pgmms')
    [method]('pgmms.stage', 's')
    [method]('pgmms.platformGameMiniGameMode', 'pgmm')
    [method]('pgmm.mode', 'm')
    [method]('pgmm.platformGameMiniGame', 'pgm')
    [method]('pgm.gameMiniGame', 'gm')
    [method]('gm.game', 'g')
    [method]('gm.miniGame', 'mg')
    [method]('pgm.platform', 'p')
    [method]('score.scorePlayers', 'sp')
    [method]('sp.platformGameMiniGameModeCharacterCostume', 'pgmmcc')
    [method]('pgmmcc.characterCostume', 'cc')
    [method]('cc.character', 'c')
    [method]('sp.player', 'pl')
    .leftJoinAndSelect('pl.inputType', 'it');
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

export function fromScoreToName(score: Score | null | undefined): string | null {
  if (!score) {
    return null;
  }
  const platformGameMiniGameMode = score.platformGameMiniGameModeStage.platformGameMiniGameMode;
  const platformGameMiniGame = platformGameMiniGameMode.platformGameMiniGame;
  const platform = platformGameMiniGame.platform.shortName;
  const gameMiniGame = platformGameMiniGame.gameMiniGame;
  const game = gameMiniGame.game.shortName;
  const miniGame = gameMiniGame.miniGame.name;
  const mode = platformGameMiniGameMode.mode.name;
  const stage = score.platformGameMiniGameModeStage.stage.shortName;
  return `[${platform} ${game}] ${miniGame} - ${stage}   - ${mode} - ${formatScore(score.score)}`;
}
