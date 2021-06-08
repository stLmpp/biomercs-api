import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { ScoreRepository } from './score.repository';
import { ScoreAddDto, ScoreChangeRequestsFulfilDto, ScoreSearchDto } from './score.dto';
import { Score } from './score.entity';
import { PlatformGameMiniGameModeStageService } from '../platform/platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.service';
import { ModeService } from '../mode/mode.service';
import { ScorePlayerService } from './score-player/score-player.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ScoreViewModel } from './view-model/score.view-model';
import { MapperService } from '../mapper/mapper.service';
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
import { arrayRemoveMutate, orderBy } from 'st-utils';
import { addSeconds } from 'date-fns';
import {
  ScoreChangeRequestsPaginationViewModel,
  ScoreChangeRequestsViewModel,
} from './view-model/score-change-request.view-model';
import { ScoreChangeRequestService } from './score-change-request/score-change-request.service';
import { ScoreChangeRequest } from './score-change-request/score-change-request.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { StageViewModel } from '../stage/stage.view-model';
import { ScoreGateway } from './score.gateway';
import { MailService } from '../mail/mail.service';
import { MailInfo } from '../mail/mail-info.interface';
import { ScoreGroupedByStatusViewModel } from './view-model/score-grouped-by-status.view-model';
import { ScoreStatusEnum } from './score-status/score-status.enum';
import { ScoreStatusService } from './score-status/score-status.service';

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
    private scoreChangeRequestService: ScoreChangeRequestService,
    private scoreGateway: ScoreGateway,
    private mailService: MailService,
    private scoreStatusService: ScoreStatusService
  ) {}

  private async _sendEmailScoreApproved(idScore: number): Promise<void> {
    const score = await this.scoreRepository.findByIdWithAllRelations(idScore);
    const playerCreated = await this.playerService.findByIdWithUser(score.createdByIdPlayer);
    if (playerCreated.user) {
      const {
        platformGameMiniGameModeStage: {
          stage,
          platformGameMiniGameMode: {
            mode,
            platformGameMiniGame: {
              platform,
              gameMiniGame: { game, miniGame },
            },
          },
        },
      } = score;
      await this.mailService.sendMailInfo(
        {
          to: playerCreated.user.email,
          subject: 'Biomercs2 - Score approved',
        },
        {
          title: 'Score approved',
          info: [
            {
              title: 'Platform',
              value: platform.name,
            },
            {
              title: 'Game',
              value: game.name,
            },
            {
              title: 'Mini game',
              value: miniGame.name,
            },
            {
              title: 'Mode',
              value: mode.name,
            },
            {
              title: 'Stage',
              value: stage.name,
            },
            ...score.scorePlayers.reduce(
              (acc, { player, evidence, platformGameMiniGameModeCharacterCostume: { characterCostume } }, index) => [
                ...acc,
                {
                  title: `Player ${index + 1}`,
                  value: `${player.personaName} (${characterCostume.character.name} ${characterCostume.name})`,
                },
                {
                  title: 'Evidence',
                  value: evidence,
                },
              ],
              [] as MailInfo[]
            ),
            { title: 'Score', value: score.score.toLocaleString('pt-BR', { maximumFractionDigits: 0 }) },
          ],
        }
      );
    }
  }

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
    const idPlatformGameMiniGameModeStage =
      await this.platformGameMiniGameModeStageService.findIdByPlatformGameMiniGameModeStage(
        idPlatform,
        idGame,
        idMiniGame,
        idMode,
        idStage
      );
    let idScoreStatus = ScoreStatusEnum.AwaitingApprovalAdmin;
    if (mode.playerQuantity > 1) {
      const idOtherPlayers = scorePlayers
        .filter(scorePlayer => scorePlayer.idPlayer !== createdByIdPlayer)
        .map(scorePlayer => scorePlayer.idPlayer);
      const otherPlayers = await this.playerService.findByIdsWithUser(idOtherPlayers);
      const isAllOtherPlayersBanned = otherPlayers.every(player => player.user?.bannedDate);
      // If all partners are banned, then, the approval will go directly to the admin
      if (!isAllOtherPlayersBanned) {
        idScoreStatus = ScoreStatusEnum.AwaitingApprovalPlayer;
      }
    }

    const score = await this.scoreRepository.save(
      new Score().extendDto({ ...dto, idPlatformGameMiniGameModeStage, idScoreStatus, createdByIdPlayer })
    );
    if (scorePlayers.every(scorePlayer => !scorePlayer.host)) {
      const hostPlayer =
        scorePlayers.find(scorePlayer => scorePlayer.idPlayer === createdByIdPlayer) ?? scorePlayers[0];
      scorePlayers = scorePlayers.map(
        scorePlayer => new ScorePlayerAddDto({ ...scorePlayer, host: hostPlayer.idPlayer === scorePlayer.idPlayer })
      );
    }
    await this.scorePlayerService.addMany(score.id, idPlatform, idGame, idMiniGame, idMode, scorePlayers);
    this.scoreGateway.updateCountApprovals();
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
    if (![ScoreStatusEnum.AwaitingApprovalAdmin, ScoreStatusEnum.RejectedByAdmin].includes(score.idScoreStatus)) {
      throw new BadRequestException(`Score is not awaiting for Admin approval`);
    }
    const approvalDate = new Date();
    await Promise.all([
      this.scoreApprovalService.addAdmin({ ...dto, idUser: user.id, action, actionDate: approvalDate, idScore }),
      this.scoreRepository.update(idScore, {
        idScoreStatus:
          action === ScoreApprovalActionEnum.Approve ? ScoreStatusEnum.Approved : ScoreStatusEnum.RejectedByAdmin,
        approvalDate,
      }),
    ]);
    // This check is only needed if the score is approved
    if (action === ScoreApprovalActionEnum.Approve) {
      await Promise.all([
        this.scoreWorldRecordService.checkForWorldRecord({
          idPlatformGameMiniGameModeStage: score.idPlatformGameMiniGameModeStage,
          fromDate: addSeconds(approvalDate, -5),
          idPlatformGameMiniGameModeCharacterCostumes: orderBy(
            score.scorePlayers.map(scorePlayer => scorePlayer.idPlatformGameMiniGameModeCharacterCostume)
          ),
        }),
        this._sendEmailScoreApproved(score.id),
      ]);
    }
    this.scoreGateway.updateCountApprovals();
  }

  @Transactional()
  async approvalPlayer(
    idScore: number,
    dto: ScoreApprovalAddDto,
    user: User,
    action: ScoreApprovalActionEnum
  ): Promise<void> {
    const score = await this.scoreRepository.findOneOrFail(idScore);
    if (![ScoreStatusEnum.AwaitingApprovalPlayer, ScoreStatusEnum.RejectedByPlayer].includes(score.idScoreStatus)) {
      throw new BadRequestException(`Score is not awaiting for Player approval`);
    }
    const idPlayer = await this.playerService.findIdByIdUser(user.id);
    await this.scoreApprovalService.addPlayer({ ...dto, idPlayer, action, actionDate: new Date(), idScore });
    const [countPlayers, countApprovals] = await Promise.all([
      this.scorePlayerService.findCountByIdScoreWithoutCreator(idScore),
      this.scoreApprovalService.findCountByIdScoreWithoutCreator(idScore),
    ]);
    // Needs to be >=, because a player might be banned during the approval
    if (countApprovals >= countPlayers || action === ScoreApprovalActionEnum.Reject) {
      await this.scoreRepository.update(idScore, {
        idScoreStatus:
          action === ScoreApprovalActionEnum.Approve
            ? ScoreStatusEnum.AwaitingApprovalAdmin
            : ScoreStatusEnum.RejectedByPlayer,
      });
    }
    this.scoreGateway.updateCountApprovals();
  }

  @Transactional()
  async requestChanges(idScore: number, dtos: string[]): Promise<ScoreChangeRequest[]> {
    await this.scoreRepository.update(idScore, { idScoreStatus: ScoreStatusEnum.ChangesRequested });
    const scoreChangeRequests = await this.scoreChangeRequestService.addMany(idScore, dtos);
    this.scoreGateway.updateCountApprovals();
    return scoreChangeRequests;
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
      updateScore.idScoreStatus = ScoreStatusEnum.AwaitingApprovalAdmin;
    }
    if (scorePlayers?.length) {
      await this.scorePlayerService.updateMany(scorePlayers);
    }
    await this.scoreRepository.update(idScore, updateScore);
    this.scoreGateway.updateCountApprovals();
    return hasAnyRequestChanges;
  }

  async transferScores(oldIdPlayer: number, newIdPlayer: number): Promise<void> {
    await this.scoreRepository.update({ createdByIdPlayer: oldIdPlayer }, { createdByIdPlayer: newIdPlayer });
    await this.scorePlayerService.transferScores(oldIdPlayer, newIdPlayer);
  }

  async findByIdMapped(idScore: number): Promise<ScoreViewModel> {
    return this.mapperService.map(Score, ScoreViewModel, await this.scoreRepository.findByIdWithAllRelations(idScore));
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
      const player = scores
        .find(score => score)!
        .scorePlayers.find(scorePlayer => scorePlayer.idPlayer === idPlayer)!.player;
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
      scoreTable.idCharacterCostume = platformGameMiniGameModeCharacterCostume.idCharacterCostume;
      scoreTable.characterName = platformGameMiniGameModeCharacterCostume.characterCostume.character.name;
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
    scoreTableWorldRecord.idCharacterCostume = -1;
    scoreTableWorldRecord.characterName = 'All';
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

  async searchScores(dto: ScoreSearchDto, idUser: number): Promise<Pagination<ScoreViewModel>> {
    let idPlayer: number | undefined;
    if (dto.onlyMyScores) {
      idPlayer = await this.playerService.findIdByIdUser(idUser);
    }
    const pagination = await this.scoreRepository.searchScores(dto, idPlayer);
    return { ...pagination, items: this.mapperService.map(Score, ScoreViewModel, pagination.items) };
  }

  async findRejectedAndPendingScoresByIdUser(idUser: number): Promise<ScoreGroupedByStatusViewModel[]> {
    const idPlayer = await this.playerService.findIdByIdUser(idUser);
    const scoresRaw = await this.scoreRepository.findRejectedAndPendingScoresByIdUser(idPlayer);
    const scoreViewModels = this.mapperService.map(Score, ScoreViewModel, scoresRaw);
    const allStatus = await this.scoreStatusService.findByIds([
      ScoreStatusEnum.AwaitingApprovalAdmin,
      ScoreStatusEnum.AwaitingApprovalPlayer,
      ScoreStatusEnum.RejectedByAdmin,
      ScoreStatusEnum.RejectedByPlayer,
    ]);
    return allStatus.map(status => {
      const scoreGroupedByStatusViewModel = new ScoreGroupedByStatusViewModel();
      scoreGroupedByStatusViewModel.scores = arrayRemoveMutate(
        scoreViewModels,
        score => score.idScoreStatus === status.id
      );
      scoreGroupedByStatusViewModel.idScoreStatus = status.id;
      scoreGroupedByStatusViewModel.description = status.description;
      return scoreGroupedByStatusViewModel;
    });
  }
}
