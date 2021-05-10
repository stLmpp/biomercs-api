import { Connection, EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Score } from './score.entity';
import { PaginationMeta } from '../shared/view-model/pagination.view-model';
import { ScoreStatusEnum } from './score-status.enum';
import { ScoreApprovalParams } from './score.params';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ScoreApproval } from './score-approval/score-approval.entity';
import { ScoreApprovalActionEnum } from './score-approval/score-approval-action.enum';
import { OrderByDirection } from 'st-utils';
import { ScorePlayer } from './score-player/score-player.entity';
import { ScoreSearchDto } from './score.dto';
import { ScoreWorldRecordTypeEnum } from './score-world-record/score-world-record-type.enum';

@EntityRepository(Score)
export class ScoreRepository extends Repository<Score> {
  constructor(private connection: Connection) {
    super();
  }

  private _createQueryBuilderRelations(
    idPlatform?: number,
    idGame?: number,
    idMiniGame?: number,
    idMode?: number,
    idStage?: number
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
    if (idStage) {
      queryBuilder.andWhere('s.id = :idStage', { idStage });
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
    return this._createQueryBuilderScore(idPlatform, idGame, idMiniGame, idMode, queryBuilder).andWhere(
      'sp.idPlayer = :idPlayer',
      { idPlayer }
    );
  }

  private _resolveOrderByApproval(orderBy: string): string {
    switch (orderBy) {
      case 'game':
        return 'g.shortName';
      case 'miniGame':
        return 'mg.name';
      case 'mode':
        return 'm.name';
      case 'stage':
        return 's.shortName';
      case 'score':
        return 'score.score';
      case 'lastUpdatedDate':
        return 'score.lastUpdatedDate';
      default:
        return 'score.creationDate';
    }
  }

  private _includeScoreWorldRecord(alias: string, queryBuilder: SelectQueryBuilder<Score>): SelectQueryBuilder<Score> {
    return queryBuilder
      .leftJoinAndSelect(`${alias}.scoreWorldRecords`, 'swr', 'swr.endDate is null')
      .leftJoinAndSelect('swr.scoreWorldRecordCharacters', 'swrc');
  }

  async findByIdWithAllRelations(idScore: number): Promise<Score> {
    return this._includeScoreWorldRecord('score', this._createQueryBuilderRelations())
      .andWhere('score.id = :idScore', { idScore })
      .getOneOrFail();
  }

  async findByIdsWithAllRelations(idsScores: number[]): Promise<Score[]> {
    const queryBuilder = this._includeScoreWorldRecord('score', this._createQueryBuilderRelations());
    if (idsScores.length) {
      return queryBuilder.andWhere('score.id in (:...idsScores)', { idsScores }).getMany();
    } else {
      return [];
    }
  }

  async findLeaderboards(
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
            .addSelect('sp.idPlayer', 'id')
            .addSelect('max(s.score)', 'score')
            .addGroupBy('pgmms.id')
            .addGroupBy('sp.idPlayer'),
        't'
      )
      .addSelect('id', 'id')
      .addSelect('sum(score)', 'score')
      .groupBy('id')
      .orderBy('score', 'DESC')
      .paginateRaw<{ id: number }>(page, limit);
    const idsPlayers = items.map(row => row.id);
    const map = new Map<number, Score[]>();
    for (const idPlayer of idsPlayers) {
      const qb = this._createQueryBuilderRelations(idPlatform, idGame, idMiniGame, idMode)
        .innerJoin(
          subQuery =>
            this._createQueryBuilderPlayer(idPlatform, idGame, idMiniGame, idMode, idPlayer, subQuery.from(Score, 's'))
              .addSelect('pgmms.id', 'pgmms_id')
              .addSelect('max(s.score)', 'score')
              .andWhere('s.status = :status', { status: ScoreStatusEnum.Approved })
              .addGroupBy('pgmms_id'),
          't',
          '(t.pgmms_id = score.idPlatformGameMiniGameModeStage and t.score = score.score)'
        )
        .andWhere('score.status = :status', { status: ScoreStatusEnum.Approved });
      map.set(idPlayer, await this._includeScoreWorldRecord('score', qb).getMany());
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
    orderBy,
    orderByDirection,
    idStage,
  }: ScoreApprovalParams): Promise<Pagination<Score>> {
    return this._createQueryBuilderRelations(idPlatform, idGame, idMiniGame, idMode, idStage)
      .andWhere('score.status = :status', { status: ScoreStatusEnum.AwaitingApprovalAdmin })
      .andNotExists(sb =>
        sb
          .from(ScoreApproval, 'sa')
          .andWhere('sa.idScore = score.id')
          .andWhere('sa.action != :action', { action: ScoreApprovalActionEnum.Approve })
      )
      .orderBy(this._resolveOrderByApproval(orderBy), orderByDirection.toUpperCase() as Uppercase<OrderByDirection>)
      .paginate(page, limit);
  }

  async findApprovalListUser(
    idPlayer: number,
    { idMiniGame, idPlatform, idMode, idGame, limit, page, orderBy, orderByDirection, idStage }: ScoreApprovalParams
  ): Promise<Pagination<Score>> {
    return this._createQueryBuilderRelations(idPlatform, idGame, idMiniGame, idMode, idStage)
      .andWhere('score.status = :status', { status: ScoreStatusEnum.AwaitingApprovalPlayer })
      .andWhere('score.createdByIdPlayer != :createdByIdPlayer', { createdByIdPlayer: idPlayer })
      .andExists(sb =>
        sb
          .from(ScorePlayer, 'sp1')
          .andWhere('sp1.idScore = score.id')
          .andWhere('sp1.idPlayer = :idPlayer', { idPlayer })
      )
      .andNotExists(sb =>
        sb
          .from(ScoreApproval, 'sa')
          .andWhere('sa.idScore = score.id')
          .andWhere('sa.actionByPlayer = :actionByPlayer', { actionByPlayer: idPlayer })
          .andWhere('sa.action != :action', { action: ScoreApprovalActionEnum.Approve })
      )
      .orderBy(this._resolveOrderByApproval(orderBy), orderByDirection.toUpperCase() as Uppercase<OrderByDirection>)
      .paginate(page, limit);
  }

  async findTopScoreByIdPlatformGameMiniGameModeStage(
    idPlatformGameMiniGameModeStage: number,
    fromDate: Date
  ): Promise<Score | undefined> {
    return this.createQueryBuilder('score')
      .andWhere('score.status = :status', { status: ScoreStatusEnum.Approved })
      .andWhere('score.idPlatformGameMiniGameModeStage = :idPlatformGameMiniGameModeStage', {
        idPlatformGameMiniGameModeStage,
      })
      .andWhere('score.approvalDate >= :fromDate', { fromDate })
      .andWhere(
        sb =>
          `${sb
            .subQuery()
            .from(Score, 's')
            .andWhere('s.status = :status', { status: ScoreStatusEnum.Approved })
            .andWhere('s.idPlatformGameMiniGameModeStage = :idPlatformGameMiniGameModeStage', {
              idPlatformGameMiniGameModeStage,
            })
            .andWhere('s.approvalDate >= :fromDate', { fromDate })
            .select('max(s.score)', 'max_score')
            .getQuery()} = score.score`
      )
      .getOne();
  }

  async findTopScoreByIdPlatformGameMiniGameModeStageAndCharacterCostume(
    idPlatformGameMiniGameModeStage: number,
    idPlatformGameMiniGameModeCharacterCostume: number,
    fromDate: Date
  ): Promise<Score | undefined> {
    return this.createQueryBuilder('score')
      .innerJoin('score.scorePlayers', 'scorePlayer')
      .andWhere(
        'scorePlayer.idPlatformGameMiniGameModeCharacterCostume = :idPlatformGameMiniGameModeCharacterCostume',
        { idPlatformGameMiniGameModeCharacterCostume }
      )
      .andWhere('score.status = :status', { status: ScoreStatusEnum.Approved })
      .andWhere('score.idPlatformGameMiniGameModeStage = :idPlatformGameMiniGameModeStage', {
        idPlatformGameMiniGameModeStage,
      })
      .andWhere('score.approvalDate >= :fromDate', { fromDate })
      .andWhere(
        sb =>
          `${sb
            .subQuery()
            .from(Score, 's')
            .innerJoin('s.scorePlayers', 'sp')
            .andWhere('sp.idPlatformGameMiniGameModeCharacterCostume = :idPlatformGameMiniGameModeCharacterCostume', {
              idPlatformGameMiniGameModeCharacterCostume,
            })
            .andWhere('s.status = :status', { status: ScoreStatusEnum.Approved })
            .andWhere('s.idPlatformGameMiniGameModeStage = :idPlatformGameMiniGameModeStage', {
              idPlatformGameMiniGameModeStage,
            })
            .andWhere('s.approvalDate >= :fromDate', { fromDate })
            .select('max(s.score)', 'max_score')
            .getQuery()} = score.score`
      )
      .getOne();
  }

  queryDifferentCharacters(
    qb: SelectQueryBuilder<Score>,
    idPlatformGameMiniGameModeCharacterCostumes: number[],
    alias: string
  ): SelectQueryBuilder<Score> {
    const len = idPlatformGameMiniGameModeCharacterCostumes.length;
    for (let i = 0; i < len; i++) {
      const idPlatformGameMiniGameModeCharacterCostume = idPlatformGameMiniGameModeCharacterCostumes[i];
      const tableAlias = `${alias}sp${i}`;
      const columnAlias = `${alias}${tableAlias}idPlatformGameMiniGameModeCharacterCostume`;
      qb.innerJoin(`${alias}.scorePlayers`, tableAlias).andWhere(
        `${tableAlias}.idPlatformGameMiniGameModeCharacterCostume = :${columnAlias}`,
        {
          [columnAlias]: idPlatformGameMiniGameModeCharacterCostume,
        }
      );
      for (let j = 0; j < len; j++) {
        if (i !== j) {
          const tableAlias2 = `${alias}sp${j}`;
          qb.andWhere(`${tableAlias2}.id != ${tableAlias}.id`);
        }
      }
    }
    return qb;
  }

  async findTopCombinationScoreByIdPlatformGameMiniGameModeStageAndCharacterCostumes(
    idPlatformGameMiniGameModeStage: number,
    idPlatformGameMiniGameModeCharacterCostumes: number[],
    fromDate: Date
  ): Promise<Score | undefined> {
    const qb = this.createQueryBuilder('score')
      .andWhere('score.status = :status', { status: ScoreStatusEnum.Approved })
      .andWhere('score.idPlatformGameMiniGameModeStage = :idPlatformGameMiniGameModeStage', {
        idPlatformGameMiniGameModeStage,
      })
      .andWhere('score.approvalDate >= :fromDate', { fromDate })
      .andWhere(sb => {
        const subQuery = sb
          .subQuery()
          .from(Score, 's')
          .andWhere('s.status = :status', { status: ScoreStatusEnum.Approved })
          .andWhere('s.idPlatformGameMiniGameModeStage = :idPlatformGameMiniGameModeStage', {
            idPlatformGameMiniGameModeStage,
          })
          .andWhere('s.approvalDate >= :fromDate', { fromDate })
          .select('max(s.score)', 'max_score');
        return `${this.queryDifferentCharacters(
          subQuery,
          idPlatformGameMiniGameModeCharacterCostumes,
          's'
        ).getQuery()} = score.score`;
      });
    return this.queryDifferentCharacters(qb, idPlatformGameMiniGameModeCharacterCostumes, 'score').getOne();
  }

  async findScoresWithChangeRequests(idPlayer: number, page: number, limit: number): Promise<Pagination<Score>> {
    let pagination = await this.createQueryBuilder('score')
      .innerJoin('score.scorePlayers', 'sp')
      .innerJoin('score.scoreChangeRequests', 'scr')
      .andWhere('scr.dateFulfilled is null')
      .andWhere('score.status = :status', { status: ScoreStatusEnum.ChangesRequested })
      .andWhere('sp.idPlayer = :idPlayer', { idPlayer })
      .select('score.id')
      .paginate(page, limit);
    // There's no need to do the next query if there isn't any score
    if (pagination.items.length) {
      pagination = {
        ...pagination,
        items: await this._createQueryBuilderRelations()
          .innerJoinAndSelect('score.scoreChangeRequests', 'scr')
          .andWhere('scr.dateFulfilled is null')
          .andWhere('score.id in (:...ids)', { ids: pagination.items.map(score => score.id) })
          .getMany(),
      };
    }
    return pagination;
  }

  async findApprovalPlayerCount(idPlayer: number): Promise<number> {
    return this._createQueryBuilderRelations()
      .andWhere('score.status = :status', { status: ScoreStatusEnum.AwaitingApprovalPlayer })
      .andWhere('score.createdByIdPlayer != :createdByIdPlayer', { createdByIdPlayer: idPlayer })
      .andExists(sb =>
        sb
          .from(ScorePlayer, 'sp1')
          .andWhere('sp1.idScore = score.id')
          .andWhere('sp1.idPlayer = :idPlayer', { idPlayer })
      )
      .andNotExists(sb =>
        sb
          .from(ScoreApproval, 'sa')
          .andWhere('sa.idScore = score.id')
          .andWhere('sa.actionByPlayer = :actionByPlayer', { actionByPlayer: idPlayer })
          .andWhere('sa.action != :action', { action: ScoreApprovalActionEnum.Approve })
      )
      .getCount();
  }

  async findApprovalAdminCount(): Promise<number> {
    return this._createQueryBuilderRelations()
      .andWhere('score.status = :status', { status: ScoreStatusEnum.AwaitingApprovalAdmin })
      .andNotExists(sb =>
        sb
          .from(ScoreApproval, 'sa')
          .andWhere('sa.idScore = score.id')
          .andWhere('sa.action != :action', { action: ScoreApprovalActionEnum.Approve })
      )
      .getCount();
  }

  async findScoresWithChangeRequestsCount(idPlayer: number): Promise<number> {
    return this._createQueryBuilderRelations()
      .innerJoinAndSelect('score.scoreChangeRequests', 'scr')
      .andWhere('scr.dateFulfilled is null')
      .andWhere('score.status = :status', { status: ScoreStatusEnum.ChangesRequested })
      .andExists(sb =>
        sb
          .from(ScorePlayer, 'sp1')
          .andWhere('sp1.idScore = score.id')
          .andWhere('sp1.idPlayer = :idPlayer', { idPlayer })
      )
      .getCount();
  }

  async searchScores(dto: ScoreSearchDto, idPlayer?: number): Promise<Pagination<Score>> {
    const queryBuilder = this._createQueryBuilderRelations();
    this._includeScoreWorldRecord('score', queryBuilder);
    if (dto.status) {
      queryBuilder.andWhere('score.status = :status', { status: dto.status });
    }
    if (dto.score) {
      if (dto.score.toLowerCase().endsWith('k')) {
        dto.score = dto.score.slice(0, -1);
        const scoreStart = +(dto.score + '000');
        const scoreEnd = +(dto.score + '999');
        if (!isNaN(scoreStart) && !isNaN(scoreEnd)) {
          queryBuilder.andWhere('score.score between :scoreStart and :scoreEnd', { scoreStart, scoreEnd });
        }
      } else {
        const scoreNumber = +dto.score;
        if (!isNaN(scoreNumber)) {
          queryBuilder.andWhere('score.score = :score', { score: scoreNumber });
        }
      }
    }
    if (dto.idPlatforms?.length) {
      queryBuilder.andWhere('p.id in (:...idPlatforms)', { idPlatforms: dto.idPlatforms });
    }
    if (dto.idGames?.length) {
      queryBuilder.andWhere('g.id in (:...idGames)', { idGames: dto.idGames });
    }
    if (dto.idMiniGames?.length) {
      queryBuilder.andWhere('mg.id in (:...idMiniGames)', { idMiniGames: dto.idMiniGames });
    }
    if (dto.idModes?.length) {
      queryBuilder.andWhere('m.id in (:...idModes)', { idModes: dto.idModes });
    }
    if (dto.idCharacterCostumes?.length) {
      queryBuilder.andWhere('cc.id in (:...idCharacterCostumes)', { idCharacterCostumes: dto.idCharacterCostumes });
    }
    if (dto.worldRecord || dto.characterWorldRecord || dto.combinationWorldRecord) {
      let type: ScoreWorldRecordTypeEnum;
      if (dto.characterWorldRecord) {
        type = ScoreWorldRecordTypeEnum.CharacterWorldRecord;
      } else if (dto.combinationWorldRecord) {
        type = ScoreWorldRecordTypeEnum.CombinationWorldRecord;
      } else {
        type = ScoreWorldRecordTypeEnum.WorldRecord;
      }
      queryBuilder.andWhere('swr.type = :type', { type });
    }
    if (dto.onlyMyScores && idPlayer) {
      queryBuilder.andWhere('pl.id = :idPlayer', { idPlayer });
    }
    const { items, meta } = await queryBuilder.select('score.id').paginate(dto.page, dto.limit);
    const scores = await this.findByIdsWithAllRelations(items.map(raw => raw.id));
    return {
      items: items.map(raw => scores.find(_score => _score.id === raw.id)!),
      meta,
    };
  }

  async findWorldRecordsTable(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Promise<Score[]> {
    const queryBuilderBase = this._createQueryBuilderRelations(idPlatform, idGame, idMiniGame, idMode)
      .andWhere('score.status = :status', { status: ScoreStatusEnum.Approved })
      .innerJoinAndSelect(`score.scoreWorldRecords`, 'swr', 'swr.endDate is null')
      .innerJoinAndSelect('swr.scoreWorldRecordCharacters', 'swrc');
    const ids = await queryBuilderBase
      .clone()
      .andWhere('swr.type = :type', { type: ScoreWorldRecordTypeEnum.CharacterWorldRecord })
      .select('score.id')
      .getMany()
      .then(scores => scores.map(score => score.id));
    let scores: Score[] = [];
    if (ids.length) {
      scores = await queryBuilderBase.clone().andWhere('score.id in (:...ids)', { ids }).getMany();
    }
    return scores;
  }
}
