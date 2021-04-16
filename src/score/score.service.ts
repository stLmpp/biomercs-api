import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { ScoreRepository } from './score.repository';
import { ScoreAddDto, ScoreChangeRequestsFulfilDto, ScoreSearchDto } from './score.dto';
import { Score } from './score.entity';
import { PlatformGameMiniGameModeStageService } from '../platform/platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.service';
import { ModeService } from '../mode/mode.service';
import { ScoreStatusEnum } from './score-status.enum';
import { ScorePlayerService } from './score-player/score-player.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ScoreViewModel } from './view-model/score.view-model';
import { MapperService } from '../mapper/mapper.service';
import { random } from '../util/util';
import { ScorePlayer } from './score-player/score-player.entity';
import { PlayerService } from '../player/player.service';
import { PlatformGameMiniGameModeCharacterCostumeService } from '../platform/platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.service';
import {
  ScoreTableViewModel,
  ScoreTableWorldRecordViewModel,
  ScoreTopTableViewModel,
  ScoreTopTableWorldRecordViewModel,
} from './view-model/score-table.view-model';
import { User } from '../user/user.entity';
import { ScoreApprovalParams } from './score.params';
import { ScorePlayerAddDto } from './score-player/score-player.dto';
import { ScoreApprovalService } from './score-approval/score-approval.service';
import { ScoreApprovalViewModel } from './view-model/score-approval.view-model';
import { ScoreApprovalAddDto } from './score-approval/score-approval.dto';
import { ScoreApprovalActionEnum } from './score-approval/score-approval-action.enum';
import { Stage } from '../stage/stage.entity';
import { ScoreWorldRecordService } from './score-world-record/score-world-record.service';
import { isNil, orderBy } from 'st-utils';
import { addSeconds } from 'date-fns';
import {
  ScoreChangeRequestsPaginationViewModel,
  ScoreChangeRequestsViewModel,
} from './view-model/score-change-request.view-model';
import { ScoreChangeRequestService } from './score-change-request/score-change-request.service';
import { ScoreChangeRequest } from './score-change-request/score-change-request.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { StageViewModel } from '../stage/stage.view-model';
import { ScoreWorldRecordHistoryDto } from './score-world-record/score-world-record.dto';

@Injectable()
export class ScoreService {
  constructor(
    private scoreRepository: ScoreRepository,
    private platformGameMiniGameModeStageService: PlatformGameMiniGameModeStageService,
    private modeService: ModeService,
    private scorePlayerService: ScorePlayerService,
    private mapperService: MapperService,
    @Inject(forwardRef(() => PlayerService)) private playerService: PlayerService,
    private platformGameMiniGameModeCharacterCostumeService: PlatformGameMiniGameModeCharacterCostumeService,
    private scoreApprovalService: ScoreApprovalService,
    @Inject(forwardRef(() => ScoreWorldRecordService)) private scoreWorldRecordService: ScoreWorldRecordService,
    private scoreChangeRequestService: ScoreChangeRequestService
  ) {}

  @Transactional()
  async add(
    { idPlatform, idGame, idMiniGame, idMode, idStage, scorePlayers, ...dto }: ScoreAddDto,
    user: User
  ): Promise<ScoreViewModel> {
    const [mode, createdByIdPlayer] = await Promise.all([
      this.modeService.findById(idMode),
      this.playerService.findIdByIdUser(user.id),
    ]);
    if (mode.playerQuantity !== scorePlayers.length) {
      throw new BadRequestException(
        `This mode requires ${mode.playerQuantity} player(s), but we received ${scorePlayers.length}`
      );
    }
    const idPlatformGameMiniGameModeStage = await this.platformGameMiniGameModeStageService.findIdByPlatformGameMiniGameModeStage(
      idPlatform,
      idGame,
      idMiniGame,
      idMode,
      idStage
    );
    const status =
      mode.playerQuantity > 1 ? ScoreStatusEnum.AwaitingApprovalPlayer : ScoreStatusEnum.AwaitingApprovalAdmin;
    const score = await this.scoreRepository.save(
      new Score().extendDto({ ...dto, idPlatformGameMiniGameModeStage, status, createdByIdPlayer })
    );
    if (scorePlayers.every(scorePlayer => !scorePlayer.host)) {
      const hostPlayer =
        scorePlayers.find(scorePlayer => scorePlayer.idPlayer === createdByIdPlayer) ?? scorePlayers[0];
      scorePlayers = scorePlayers.map(
        scorePlayer => new ScorePlayerAddDto({ ...scorePlayer, host: hostPlayer.idPlayer === scorePlayer.idPlayer })
      );
    }
    await this.scorePlayerService.addMany(score.id, idPlatform, idGame, idMiniGame, idMode, scorePlayers);
    return this.findByIdMapped(score.id);
  }

  @Transactional()
  async approvalAdmin(
    idScore: number,
    dto: ScoreApprovalAddDto,
    user: User,
    action: ScoreApprovalActionEnum
  ): Promise<void> {
    const score = await this.scoreRepository.findOneOrFail(idScore, { relations: ['scorePlayers'] });
    if (![ScoreStatusEnum.AwaitingApprovalAdmin, ScoreStatusEnum.RejectedByAdmin].includes(score.status)) {
      throw new BadRequestException(`Score is not awaiting for Admin approval`);
    }
    const promises: Promise<any>[] = [
      this.scoreApprovalService.addAdmin({ ...dto, idUser: user.id, action, actionDate: new Date(), idScore }),
      this.scoreRepository.update(idScore, {
        status: action === ScoreApprovalActionEnum.Approve ? ScoreStatusEnum.Approved : ScoreStatusEnum.RejectedByAdmin,
        approvalDate: new Date(),
      }),
    ];
    // This check is only needed if the score is approved
    if (action === ScoreApprovalActionEnum.Approve) {
      promises.push(
        this.scoreWorldRecordService.checkForWorldRecord({
          idPlatformGameMiniGameModeStage: score.idPlatformGameMiniGameModeStage,
          fromDate: addSeconds(score.creationDate, -5),
          idPlatformGameMiniGameModeCharacterCostumes: orderBy(
            score.scorePlayers.map(scorePlayer => scorePlayer.idPlatformGameMiniGameModeCharacterCostume)
          ),
        })
      );
    }
    await Promise.all(promises);
  }

  @Transactional()
  async approvalPlayer(
    idScore: number,
    dto: ScoreApprovalAddDto,
    user: User,
    action: ScoreApprovalActionEnum
  ): Promise<void> {
    const score = await this.scoreRepository.findOneOrFail(idScore);
    if (![ScoreStatusEnum.AwaitingApprovalPlayer, ScoreStatusEnum.RejectedByPlayer].includes(score.status)) {
      throw new BadRequestException(`Score is not awaiting for Player approval`);
    }
    const idPlayer = await this.playerService.findIdByIdUser(user.id);
    await this.scoreApprovalService.addPlayer({ ...dto, idPlayer, action, actionDate: new Date(), idScore });
    const [countPlayers, countApprovals] = await Promise.all([
      this.scorePlayerService.findCountByIdScoreWithtoutCreator(idScore),
      this.scoreApprovalService.findCountByIdScoreWithoutCreator(idScore),
    ]);
    if (countPlayers === countApprovals || action === ScoreApprovalActionEnum.Reject) {
      await this.scoreRepository.update(idScore, {
        status:
          action === ScoreApprovalActionEnum.Approve
            ? ScoreStatusEnum.AwaitingApprovalAdmin
            : ScoreStatusEnum.RejectedByPlayer,
      });
    }
  }

  @Transactional()
  async requestChanges(idScore: number, dtos: string[]): Promise<ScoreChangeRequest[]> {
    await this.scoreRepository.update(idScore, { status: ScoreStatusEnum.ChangesRequested });
    return this.scoreChangeRequestService.addMany(idScore, dtos);
  }

  @Transactional()
  async fulfilScoreChangeRequests(
    idScore: number,
    { idsScoreChangeRequests, scorePlayers, ...dto }: ScoreChangeRequestsFulfilDto
  ): Promise<boolean> {
    await this.scoreChangeRequestService.fulfilMany(idsScoreChangeRequests);
    const updateScore: Partial<Score> = dto;
    const hasAnyRequestChanges = await this.scoreChangeRequestService.hasAnyRequestChanges(idScore);
    if (!hasAnyRequestChanges) {
      updateScore.status = ScoreStatusEnum.AwaitingApprovalAdmin;
    }
    if (scorePlayers?.length) {
      await this.scorePlayerService.updateMany(scorePlayers);
    }
    await this.scoreRepository.update(idScore, updateScore);
    return hasAnyRequestChanges;
  }

  async transferScores(oldIdPlayer: number, newIdPlayer: number): Promise<void> {
    await this.scoreRepository.update({ createdByIdPlayer: oldIdPlayer }, { createdByIdPlayer: newIdPlayer });
    await this.scorePlayerService.transferScores(oldIdPlayer, newIdPlayer);
  }

  async findByIdMapped(idScore: number): Promise<ScoreViewModel> {
    return this.mapperService.map(Score, ScoreViewModel, await this.scoreRepository.findByIdWithAllRelations(idScore));
  }

  // TODO REMOVE
  async insert(
    options: {
      platform?: string;
      game?: string;
      miniGame?: string;
      mode?: string;
    } = {}
  ): Promise<Score> {
    const platformGameMiniGameModeStage = await this.platformGameMiniGameModeStageService.findRandom(options);
    const score = new Score();
    score.score = random(700_000, 1_500_000);
    score.status = ScoreStatusEnum.AwaitingApprovalAdmin;
    score.idPlatformGameMiniGameModeStage = platformGameMiniGameModeStage.id;
    score.maxCombo = random(100, 150);
    score.time = `${('' + random(8, 16)).padStart(2, '0')}'${('' + random(0, 59)).padStart(2, '0')}"${(
      '' + random(0, 99)
    ).padStart(2, '0')}`;
    score.lastUpdatedBy = 32;
    score.createdBy = 32;
    const scoreDb = await this.scoreRepository.save(score);
    const scorePlayers: ScorePlayer[] = await Promise.all(
      Array.from({ length: platformGameMiniGameModeStage.platformGameMiniGameMode.mode.playerQuantity }).map(
        async (_, index) => {
          const player = await this.playerService.findRandom();
          const platformGameMiniGameModeCharacterCostume = await this.platformGameMiniGameModeCharacterCostumeService.findRandom(
            platformGameMiniGameModeStage.idPlatformGameMiniGameMode
          );
          const scorePlayer = new ScorePlayer();
          scorePlayer.bulletKills = random(0, 15);
          scorePlayer.description = '';
          scorePlayer.evidence = 'www.google.com';
          scorePlayer.idPlayer = player.id;
          scorePlayer.host = !index;
          scorePlayer.idPlatformGameMiniGameModeCharacterCostume = platformGameMiniGameModeCharacterCostume.id;
          scorePlayer.createdBy = 32;
          scorePlayer.lastUpdatedBy = 32;
          scorePlayer.idScore = scoreDb.id;
          return scorePlayer;
        }
      )
    );
    score.scorePlayers = await this.scorePlayerService.addManyRandom(scorePlayers);
    return score;
  }

  async findLeaderboards(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number,
    page: number,
    limit: number
  ): Promise<ScoreTopTableViewModel> {
    const [platformGameMiniGameModeStages, [scoreMap, meta]] = await Promise.all([
      this.platformGameMiniGameModeStageService.findByPlatformGameMiniGameMode(idPlatform, idGame, idMiniGame, idMode),
      this.scoreRepository.findLeaderboards(idPlatform, idGame, idMiniGame, idMode, page, limit),
    ]);

    const scoreTableViewModel: ScoreTableViewModel[] = [];
    let position = (page - 1) * limit + 1;
    for (const [idPlayer, scores] of scoreMap) {
      const player = scores.find(score => score)!.scorePlayers.find(scorePlayer => scorePlayer.idPlayer === idPlayer)!
        .player;
      const scoreTable = new ScoreTableViewModel();
      scoreTable.idPlayer = player.id;
      scoreTable.personaName = player.personaName;
      const scoresMapped = this.mapperService.map(Score, ScoreViewModel, scores);
      scoreTable.scores = platformGameMiniGameModeStages.map(platformGameMiniGameModeStage =>
        scoresMapped.find(score => score.idPlatformGameMiniGameModeStage === platformGameMiniGameModeStage.id)
      );
      scoreTable.total = scoreTable.scores.reduce((acc, score) => acc + (score?.score ?? 0), 0);
      scoreTable.position = position++;
      scoreTableViewModel.push(scoreTable);
    }
    const stages = this.mapperService.map(
      Stage,
      StageViewModel,
      platformGameMiniGameModeStages.reduce((acc, item) => [...acc, item.stage], [] as Stage[])
    );
    return { scoreTables: scoreTableViewModel, stages, meta };
  }

  async findWorldRecordsTable(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Promise<ScoreTopTableWorldRecordViewModel> {
    const [platformGameMiniGameModeStages, platformGameMiniGameModeCharacterCostumes, scores] = await Promise.all([
      this.platformGameMiniGameModeStageService.findByPlatformGameMiniGameMode(idPlatform, idGame, idMiniGame, idMode),
      this.platformGameMiniGameModeCharacterCostumeService.findByPlatformGameMiniGameMode(
        idPlatform,
        idGame,
        idMiniGame,
        idMode
      ),
      this.scoreRepository.findWorldRecordsTable(idPlatform, idGame, idMiniGame, idMode),
    ]);
    const scoreViewModels = this.mapperService.map(Score, ScoreViewModel, scores);
    const scoreTableViewModel: ScoreTableWorldRecordViewModel[] = [];
    for (const platformGameMiniGameModeCharacterCostume of platformGameMiniGameModeCharacterCostumes) {
      const scoreTable = new ScoreTableWorldRecordViewModel();
      scoreTable.idCharacter = platformGameMiniGameModeCharacterCostume.characterCostume.idCharacter;
      scoreTable.idCharacterCustome = platformGameMiniGameModeCharacterCostume.idCharacterCostume;
      scoreTable.characaterName = platformGameMiniGameModeCharacterCostume.characterCostume.character.name;
      scoreTable.characterCostumeName = platformGameMiniGameModeCharacterCostume.characterCostume.name;
      scoreTable.characterCostumeShortName = platformGameMiniGameModeCharacterCostume.characterCostume.shortName;
      const scoresWithCharacter = scoreViewModels.filter(score =>
        score.scorePlayers.some(
          scorePlayer =>
            scorePlayer.idPlatformGameMiniGameModeCharacterCostume === platformGameMiniGameModeCharacterCostume.id &&
            scorePlayer.isCharacterWorldRecord
        )
      );
      scoreTable.scores = platformGameMiniGameModeStages.map(platformGameMiniGameModeStage =>
        scoresWithCharacter.find(score => score.idPlatformGameMiniGameModeStage === platformGameMiniGameModeStage.id)
      );
      scoreTableViewModel.push(scoreTable);
    }
    // WR
    const scoreTableWorldRecord = new ScoreTableWorldRecordViewModel();
    scoreTableWorldRecord.idCharacter = -1;
    scoreTableWorldRecord.idCharacterCustome = -1;
    scoreTableWorldRecord.characaterName = 'All';
    scoreTableWorldRecord.characterCostumeName = 'All';
    scoreTableWorldRecord.characterCostumeShortName = 'All';
    scoreTableWorldRecord.scores = platformGameMiniGameModeStages.map(platformGameMiniGameModeStage =>
      scoreViewModels.find(
        score => score.idPlatformGameMiniGameModeStage === platformGameMiniGameModeStage.id && score.isWorldRecord
      )
    );
    scoreTableViewModel.unshift(scoreTableWorldRecord);
    const scoreTopTableViewModel = new ScoreTopTableWorldRecordViewModel();
    scoreTopTableViewModel.scoreTables = scoreTableViewModel;
    scoreTopTableViewModel.stages = this.mapperService.map(
      Stage,
      StageViewModel,
      platformGameMiniGameModeStages.map(platformGameMiniGameModeStage => platformGameMiniGameModeStage.stage)
    );
    return scoreTopTableViewModel;
  }

  async findApprovalListAdmin(params: ScoreApprovalParams): Promise<ScoreApprovalViewModel> {
    if (!params.idPlatform || !params.page) {
      throw new BadRequestException('idPlatform and page are required');
    }
    const { items, meta } = await this.scoreRepository.findApprovalListAdmin(params);
    const scoreApprovalVW = new ScoreApprovalViewModel();
    scoreApprovalVW.meta = meta;
    scoreApprovalVW.scores = this.mapperService.map(Score, ScoreViewModel, items);
    return scoreApprovalVW;
  }

  async findApprovalListUser(user: User, params: ScoreApprovalParams): Promise<ScoreApprovalViewModel> {
    if (!params.idPlatform || !params.page) {
      throw new BadRequestException('idPlatform and page are required');
    }
    const idPlayer = await this.playerService.findIdByIdUser(user.id);
    const { items, meta } = await this.scoreRepository.findApprovalListUser(idPlayer, params);
    const scoreApprovalVW = new ScoreApprovalViewModel();
    scoreApprovalVW.meta = meta;
    scoreApprovalVW.scores = this.mapperService.map(Score, ScoreViewModel, items);
    return scoreApprovalVW;
  }

  async findTopScoreByIdPlatformGameMiniGameModeStage(
    idPlatformGameMiniGameModeStage: number,
    fromDate: Date
  ): Promise<Score | undefined> {
    return this.scoreRepository.findTopScoreByIdPlatformGameMiniGameModeStage(
      idPlatformGameMiniGameModeStage,
      fromDate
    );
  }

  async findTopScoreByIdPlatformGameMiniGameModeStageAndCharacterCostume(
    idPlatformGameMiniGameModeStage: number,
    idPlatformGameMiniGameModeCharacterCostume: number,
    fromDate: Date
  ): Promise<Score | undefined> {
    return this.scoreRepository.findTopScoreByIdPlatformGameMiniGameModeStageAndCharacterCostume(
      idPlatformGameMiniGameModeStage,
      idPlatformGameMiniGameModeCharacterCostume,
      fromDate
    );
  }

  async findTopCombinationScoreByIdPlatformGameMiniGameModeStageAndCharacterCostumes(
    idPlatformGameMiniGameModeStage: number,
    idPlatformGameMiniGameModeCharacterCostumes: number[],
    fromDate: Date
  ): Promise<Score | undefined> {
    return this.scoreRepository.findTopCombinationScoreByIdPlatformGameMiniGameModeStageAndCharacterCostumes(
      idPlatformGameMiniGameModeStage,
      idPlatformGameMiniGameModeCharacterCostumes,
      fromDate
    );
  }

  async findScoresWithChangeRequests(
    idUser: number,
    page: number,
    limit: number
  ): Promise<ScoreChangeRequestsPaginationViewModel> {
    const idPlayer = await this.playerService.findIdByIdUser(idUser);
    const { items, meta } = await this.scoreRepository.findScoresWithChangeRequests(idPlayer, page, limit);
    const viewModel = new ScoreChangeRequestsPaginationViewModel();
    viewModel.meta = meta;
    viewModel.scores = this.mapperService.map(Score, ScoreChangeRequestsViewModel, items);
    return viewModel;
  }

  async findApprovalPlayerCount(user: User): Promise<number> {
    const idPlayer = await this.playerService.findIdByIdUser(user.id);
    return this.scoreRepository.findApprovalPlayerCount(idPlayer);
  }

  async findApprovalAdminCount(): Promise<number> {
    return this.scoreRepository.findApprovalAdminCount();
  }

  async findScoresWithChangeRequestsCount(user: User): Promise<number> {
    const idPlayer = await this.playerService.findIdByIdUser(user.id);
    return this.scoreRepository.findScoresWithChangeRequestsCount(idPlayer);
  }

  async searchScores(
    term: string,
    status: ScoreStatusEnum,
    page: number,
    limit: number
  ): Promise<Pagination<ScoreViewModel>> {
    const dto = new ScoreSearchDto();
    dto.status = status;
    dto.combinationWorldRecord = /(combination wr|comb wr|comb world record|combwr|combination world record|combinationwr)/i.test(
      term
    );
    dto.characterWorldRecord = /(character wr|char wr|char world record|charwr|character world record|characterwr)/i.test(
      term
    );
    dto.worldRecord = /(wr|world record)/i.test(term) && !dto.combinationWorldRecord && !dto.characterWorldRecord;
    const scoreMatches = term.match(/(\d+(\.\d{3,})*)(k)?/gi) ?? [];
    dto.score = scoreMatches.reduce(
      (largest: string | null, match) => (match.length > (largest?.length || 0) ? match : largest),
      null
    );
    if (dto.score && dto.score.length < 3) {
      dto.score = null;
    }
    if (dto.score) {
      dto.score = dto.score.replace(/[,.]/gi, '');
    }
    const replace = (str: string | undefined, tokens: string[]): string | undefined =>
      isNil(str) ? str : tokens.reduce((acc, token) => acc.replace(token, ''), str);
    const resolveTest = (tokens: string[]): string | undefined =>
      replace(term.match(new RegExp(`(${tokens.join('|')})\\w+`, 'ig'))?.[0], tokens);
    dto.game = resolveTest(['game:', 'g:']);
    dto.platform = resolveTest(['platform:', 'plat:', 'p:']);
    dto.mode = resolveTest(['mode:', 'm:']);
    dto.miniGame = resolveTest(['miniGame:', 'mg:']);
    if (dto.miniGame) {
      if (/(mercs|merx|mercxs|murcs|murx|murxs|murcxs)/.test(dto.miniGame)) {
        dto.miniGame = 'mercenaries';
      }
    }
    dto.character = resolveTest(['character:', 'char:', 'c:']);
    dto.player = resolveTest(['player:', 'pl:']);
    dto.stage = resolveTest(['stage:', 's:']);
    const pagination = await this.scoreRepository.searchScores(dto, page, limit);
    return {
      ...pagination,
      items: this.mapperService.map(Score, ScoreViewModel, pagination.items),
    };
  }

  async findWorldRecordHistory(dto: ScoreWorldRecordHistoryDto): Promise<ScoreViewModel[]> {
    const scoreWorldRecords = await this.scoreWorldRecordService.findHistory(dto);
    const scores = await this.scoreRepository.findByIdsWithAllRelations(
      scoreWorldRecords.map(scoreWorldRecord => scoreWorldRecord.idScore)
    );
    const scoresOrdered = scoreWorldRecords.map(scoreWorldRecord =>
      scores.find(score => score.id === scoreWorldRecord.idScore)
    );
    return this.mapperService.map(Score, ScoreViewModel, scoresOrdered);
  }
}
