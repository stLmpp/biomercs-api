import { Connection, EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Score } from './score.entity';
import { PaginationMeta } from '../shared/view-model/pagination.view-model';
import { ScoreStatusEnum } from './score-status.enum';
import { ScoreApprovalParams } from './score.params';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ScoreApproval } from './score-approval/score-approval.entity';
import { ScoreApprovalActionEnum } from './score-approval/score-approval-action.enum';

const ALL_RELATIONS = [
  'platformGameMiniGameModeStage',
  'platformGameMiniGameModeStage.stage',
  'platformGameMiniGameModeStage.platformGameMiniGameMode',
  'platformGameMiniGameModeStage.platformGameMiniGameMode.mode',
  'platformGameMiniGameModeStage.platformGameMiniGameMode.platformGameMiniGame',
  'platformGameMiniGameModeStage.platformGameMiniGameMode.platformGameMiniGame.gameMiniGame',
  'platformGameMiniGameModeStage.platformGameMiniGameMode.platformGameMiniGame.gameMiniGame.game',
  'platformGameMiniGameModeStage.platformGameMiniGameMode.platformGameMiniGame.gameMiniGame.miniGame',
  'platformGameMiniGameModeStage.platformGameMiniGameMode.platformGameMiniGame.platform',
  'scorePlayers',
  'scorePlayers.platformGameMiniGameModeCharacterCostume',
  'scorePlayers.platformGameMiniGameModeCharacterCostume.characterCostume',
  'scorePlayers.platformGameMiniGameModeCharacterCostume.characterCostume.character',
  'scorePlayers.player',
];

@EntityRepository(Score)
export class ScoreRepository extends Repository<Score> {
  constructor(private connection: Connection) {
    super();
  }

  private _createQueryBuilderRelations(
    idPlatform?: number,
    idGame?: number,
    idMiniGame?: number,
    idMode?: number
  ): SelectQueryBuilder<Score> {
    const queryBuilder = this.createQueryBuilder('score')
      .innerJoinAndSelect('score.platformGameMiniGameModeStage', 'pgmms')
      .innerJoinAndSelect('pgmms.stage', 's')
      .innerJoinAndSelect('pgmms.platformGameMiniGameMode', 'pgmm')
      .innerJoinAndSelect('pgmm.mode', 'm')
      .innerJoinAndSelect('pgmm.platformGameMiniGame', 'pgm')
      .innerJoinAndSelect('pgm.gameMiniGame', 'gm')
      .innerJoinAndSelect('gm.game', 'g')
      .innerJoinAndSelect('gm.miniGame', 'mg')
      .innerJoinAndSelect('pgm.platform', 'p')
      .innerJoinAndSelect('score.scorePlayers', 'sp')
      .innerJoinAndSelect('sp.platformGameMiniGameModeCharacterCostume', 'pgmmcc')
      .innerJoinAndSelect('pgmmcc.characterCostume', 'cc')
      .innerJoinAndSelect('cc.character', 'c')
      .innerJoinAndSelect('sp.player', 'pl');
    if (idPlatform) {
      queryBuilder.andWhere('p.id = :idPlatform', { idPlatform });
    }
    if (idGame) {
      queryBuilder.andWhere('g.id = :idGame', { idGame });
    }
    if (idMiniGame) {
      queryBuilder.andWhere('mg.id = :idMiniGame', { idMiniGame });
    }
    if (idMode) {
      queryBuilder.andWhere('m.id = :idMode', { idMode });
    }
    return queryBuilder;
  }

  private _createQueryBuilderScore(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number,
    queryBuilder: SelectQueryBuilder<Score>
  ): SelectQueryBuilder<Score> {
    return queryBuilder
      .innerJoin('s.platformGameMiniGameModeStage', 'pgmms')
      .innerJoin('pgmms.platformGameMiniGameMode', 'pgmm')
      .innerJoin('pgmm.platformGameMiniGame', 'pgm')
      .innerJoin('pgm.gameMiniGame', 'gm')
      .innerJoin('s.scorePlayers', 'sp')
      .andWhere('pgm.idPlatform = :idPlatform', { idPlatform })
      .andWhere('gm.idGame = :idGame', { idGame })
      .andWhere('gm.idMiniGame = :idMiniGame', { idMiniGame })
      .andWhere('pgmm.idMode = :idMode', { idMode });
  }

  private _createQueryBuilderPlayer(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number,
    idPlayer: number,
    queryBuilder: SelectQueryBuilder<Score>
  ): SelectQueryBuilder<Score> {
    return this._createQueryBuilderScore(
      idPlatform,
      idGame,
      idMiniGame,
      idMode,
      queryBuilder
    ).andWhere('sp.idPlayer = :idPlayer', { idPlayer });
  }

  async findByIdWithAllRelations(idScore: number): Promise<Score> {
    return this.findOneOrFail(idScore, { relations: ALL_RELATIONS });
  }

  async findByIdsWithAllRelations(idsScores: number[]): Promise<Score[]> {
    return this.findByIds(idsScores, { relations: ALL_RELATIONS });
  }

  async findScoreTable(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number,
    page: number,
    limit: number
  ): Promise<[Map<number, Score[]>, PaginationMeta]> {
    const { meta, items } = await this.connection
      .createQueryBuilder()
      .from(
        subQuery =>
          this._createQueryBuilderScore(idPlatform, idGame, idMiniGame, idMode, subQuery.from(Score, 's'))
            .andWhere('s.status = :status', { status: ScoreStatusEnum.Approved })
            .addSelect('sp.idPlayer', 'idPlayer')
            .addSelect('max(s.score)', 'maxScore')
            .addGroupBy('pgmms.id')
            .addGroupBy('sp.idPlayer'),
        't'
      )
      .addSelect('idPlayer', 'idPlayer')
      .addSelect('sum(maxScore)', 'sumScore')
      .groupBy('idPlayer')
      .orderBy('sumScore', 'DESC')
      .paginateRaw<{ idPlayer: number }>(page, limit);
    const idsPlayers = items.map(row => row.idPlayer);
    const map = new Map<number, Score[]>();
    for (const idPlayer of idsPlayers) {
      map.set(
        idPlayer,
        await this._createQueryBuilderRelations(idPlatform, idGame, idMiniGame, idMode)
          .innerJoin(
            subQuery =>
              this._createQueryBuilderPlayer(
                idPlatform,
                idGame,
                idMiniGame,
                idMode,
                idPlayer,
                subQuery.from(Score, 's')
              )
                .addSelect('pgmms.id', 'id')
                .addSelect('max(s.score)', 'maxScore')
                .addGroupBy('id'),
            't',
            '(t.id = score.idPlatformGameMiniGameModeStage and t.maxScore = score.score)'
          )
          .getMany()
      );
    }
    return [map, meta];
  }

  async findApprovalListAdmin({
    idMiniGame,
    idPlatform,
    idMode,
    idGame,
    limit,
    page,
  }: ScoreApprovalParams): Promise<Pagination<Score>> {
    return this._createQueryBuilderRelations(idPlatform, idGame, idMiniGame, idMode)
      .andWhere('score.status = :status', { status: ScoreStatusEnum.AwaitingApprovalAdmin })
      .andNotExists(sb =>
        sb
          .from(ScoreApproval, 'sa')
          .andWhere('sa.idScore = score.id')
          .andWhere('sa.action != :action', { action: ScoreApprovalActionEnum.Approve })
      )
      .orderBy('score.creationDate', 'DESC')
      .paginate(page, limit);
  }

  async findApprovalListUser(
    idPlayer: number,
    { idMiniGame, idPlatform, idMode, idGame, limit, page }: ScoreApprovalParams
  ): Promise<Pagination<Score>> {
    return this._createQueryBuilderRelations(idPlatform, idGame, idMiniGame, idMode)
      .andWhere('score.status = :status', { status: ScoreStatusEnum.AwaitingApprovalPlayer })
      .andWhere('(score.createdByIdPlayer != :createdBy && sp.idPlayer = :idPlayer)', { createdBy: idPlayer, idPlayer })
      .andNotExists(sb =>
        sb
          .from(ScoreApproval, 'sa')
          .andWhere('sa.idScore = score.id')
          .andWhere('sa.actionByPlayer = :actionByPlayer', { actionByPlayer: idPlayer })
          .andWhere('sa.action != :action', { action: ScoreApprovalActionEnum.Approve })
      )
      .orderBy('score.creationDate', 'DESC')
      .paginate(page, limit);
  }
}
