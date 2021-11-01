import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { ScoreRepository } from './score.repository';
import { ScoreAddDto, ScoreChangeRequestsFulfilDto, ScoreSearchDto } from './score.dto';
import { Score } from './score.entity';
import { PlatformGameMiniGameModeStageService } from '../platform/platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.service';
import { ModeService } from '../mode/mode.service';
import { ScorePlayerService } from './score-player/score-player.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { PlayerService } from '../player/player.service';
import { PlatformGameMiniGameModeCharacterCostumeService } from '../platform/platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.service';
import { ScoreTable, ScoreTopTable } from './view-model/score-table.view-model';
import { User } from '../user/user.entity';
import { ScoreApprovalParams } from './score.params';
import { ScorePlayerAddDto } from './score-player/score-player.dto';
import { ScoreApprovalService } from './score-approval/score-approval.service';
import { ScoreApprovalPagination } from './view-model/score-approval.view-model';
import { ScoreApprovalAddDto } from './score-approval/score-approval.dto';
import { ScoreApprovalActionEnum } from './score-approval/score-approval-action.enum';
import { ScoreWorldRecordService } from './score-world-record/score-world-record.service';
import { arrayRemoveMutate, orderBy } from 'st-utils';
import { addSeconds } from 'date-fns';
import { ScoreChangeRequestService } from './score-change-request/score-change-request.service';
import { ScoreChangeRequest } from './score-change-request/score-change-request.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ScoreGateway } from './score.gateway';
import { MailService } from '../mail/mail.service';
import { MailInfo } from '../mail/mail-info.interface';
import { ScoresGroupedByStatus } from './view-model/score-grouped-by-status.view-model';
import { ScoreStatusEnum } from './score-status/score-status.enum';
import { ScoreStatusService } from './score-status/score-status.service';
import { ScoreTableWorldRecord, ScoreTopTableWorldRecord } from './view-model/score-table-world-record.view-model';
import { ScoreWorldRecordTypeEnum } from './score-world-record/score-world-record-type.enum';
import { NotificationService } from '../notification/notification.service';
import { NotificationTypeEnum } from '../notification/notification-type/notification-type.enum';
import { UserService } from '../user/user.service';
import { NotificationAddDto } from '../notification/notification.dto';
import { PaginationMeta } from '../shared/view-model/pagination.view-model';

@Injectable()
export class ScoreService {
  constructor(
    private scoreRepository: ScoreRepository,
    private platformGameMiniGameModeStageService: PlatformGameMiniGameModeStageService,
    private modeService: ModeService,
    private scorePlayerService: ScorePlayerService,
    @Inject(forwardRef(() => PlayerService)) private playerService: PlayerService,
    private platformGameMiniGameModeCharacterCostumeService: PlatformGameMiniGameModeCharacterCostumeService,
    private scoreApprovalService: ScoreApprovalService,
    @Inject(forwardRef(() => ScoreWorldRecordService)) private scoreWorldRecordService: ScoreWorldRecordService,
    private scoreChangeRequestService: ScoreChangeRequestService,
    private scoreGateway: ScoreGateway,
    private mailService: MailService,
    private scoreStatusService: ScoreStatusService,
    @Inject(forwardRef(() => NotificationService)) private notificationService: NotificationService,
    private userService: UserService
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
        { to: playerCreated.user.email, subject: 'Biomercs - Score approved' },
        {
          title: 'Score approved',
          info: [
            { title: 'Platform', value: platform.name },
            { title: 'Game', value: game.name },
            { title: 'Mini game', value: miniGame.name },
            { title: 'Mode', value: mode.name },
            { title: 'Stage', value: stage.name },
            ...score.scorePlayers.reduce(
              (acc, { player, evidence, platformGameMiniGameModeCharacterCostume: { characterCostume } }, index) => [
                ...acc,
                {
                  title: `Player ${index + 1}`,
                  value: `${player.personaName} (${characterCostume.character.name} ${characterCostume.name})`,
                },
                { title: 'Evidence', value: evidence },
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
    idPlayer: number
  ): Promise<Score> {
    if (scorePlayers.length && scorePlayers[0].idPlayer !== idPlayer) {
      const isAdmin = await this.userService.isAdminByPlayer(idPlayer);
      if (!isAdmin) {
        throw new BadRequestException(`You can only submit scores for yourself`);
      }
    }
    const mode = await this.modeService.findById(idMode);
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
    const score = await this.scoreRepository.save(
      new Score().extendDto({
        ...dto,
        idPlatformGameMiniGameModeStage,
        idScoreStatus: ScoreStatusEnum.AwaitingApproval,
        createdByIdPlayer: idPlayer,
      })
    );
    if (scorePlayers.every(scorePlayer => !scorePlayer.host)) {
      const hostPlayer = scorePlayers.find(scorePlayer => scorePlayer.idPlayer === idPlayer) ?? scorePlayers[0];
      scorePlayers = scorePlayers.map(
        scorePlayer => new ScorePlayerAddDto({ ...scorePlayer, host: hostPlayer.idPlayer === scorePlayer.idPlayer })
      );
    }
    await this.scorePlayerService.addMany(score.id, idPlatform, idGame, idMiniGame, idMode, scorePlayers);
    if (mode.playerQuantity > 1) {
      const idPlayersWithoutCreator = scorePlayers
        .filter(scorePlayer => scorePlayer.idPlayer !== idPlayer)
        .map(scorePlayer => scorePlayer.idPlayer);
      const idUsers = await this.userService.findIdsByPlayers(idPlayersWithoutCreator);
      if (idUsers.length) {
        const dtos: NotificationAddDto[] = idUsers.map(idUser => ({
          idUser,
          idNotificationType: NotificationTypeEnum.ScoreSubmittedManyPlayers,
          extra: { idScore: score.id, idScoreStatus: score.idScoreStatus },
        }));
        await this.notificationService.addAndSendMany(dtos);
      }
    }
    this.scoreGateway.updateCountApprovals();
    return this.scoreRepository.findByIdWithAllRelations(score.id);
  }

  @Transactional()
  async approvalAdmin(
    idScore: number,
    dto: ScoreApprovalAddDto,
    user: User,
    action: ScoreApprovalActionEnum
  ): Promise<void> {
    const score = await this.scoreRepository.findOneOrFail(idScore, { relations: ['scorePlayers'] });
    if (![ScoreStatusEnum.AwaitingApproval, ScoreStatusEnum.Rejected].includes(score.idScoreStatus)) {
      throw new BadRequestException(`Score is not awaiting for Admin approval`);
    }
    const approvalDate = new Date();
    const idScoreStatus =
      action === ScoreApprovalActionEnum.Approve ? ScoreStatusEnum.Approved : ScoreStatusEnum.Rejected;
    await Promise.all([
      this.scoreApprovalService.addAdmin({ ...dto, idUser: user.id, action, actionDate: approvalDate, idScore }),
      this.scoreRepository.update(idScore, {
        idScoreStatus,
        approvalDate,
      }),
    ]);
    // This check is only needed if the score is approved
    if (action === ScoreApprovalActionEnum.Approve) {
      await Promise.all([
        this.scoreWorldRecordService.checkForWorldRecord({
          idPlatformGameMiniGameModeStage: score.idPlatformGameMiniGameModeStage,
          date: addSeconds(approvalDate, -5),
          idPlatformGameMiniGameModeCharacterCostumes: orderBy(
            score.scorePlayers.map(scorePlayer => scorePlayer.idPlatformGameMiniGameModeCharacterCostume)
          ),
        }),
        this._sendEmailScoreApproved(score.id),
      ]);
    }
    const idUsers = await this.userService.findIdsByScore(idScore);
    if (idUsers.length) {
      const idNotificationType: NotificationTypeEnum =
        action === ScoreApprovalActionEnum.Approve
          ? NotificationTypeEnum.ScoreApproved
          : NotificationTypeEnum.ScoreRejected;
      const dtos: NotificationAddDto[] = idUsers.map(idUser => ({
        idNotificationType,
        extra: { idScore, idScoreStatus },
        idUser,
      }));
      await this.notificationService.addAndSendMany(dtos);
    }
    this.scoreGateway.updateCountApprovals();
  }

  @Transactional()
  async requestChanges(idScore: number, dtos: string[]): Promise<ScoreChangeRequest[]> {
    await this.scoreRepository.update(idScore, { idScoreStatus: ScoreStatusEnum.ChangesRequested });
    const scoreChangeRequests = await this.scoreChangeRequestService.addMany(idScore, dtos);
    const idUser = await this.userService.findIdByScore(idScore);
    if (idUser) {
      await this.notificationService.addAndSend({
        idNotificationType: NotificationTypeEnum.ScoreRequestedChanges,
        extra: { idScore, idScoreStatus: ScoreStatusEnum.ChangesRequested },
        idUser,
      });
    }
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
      updateScore.idScoreStatus = ScoreStatusEnum.AwaitingApproval;
    }
    if (scorePlayers?.length) {
      await this.scorePlayerService.updateMany(scorePlayers);
    }
    await this.scoreRepository.update(idScore, updateScore);
    this.scoreGateway.updateCountApprovals();
    await this.notificationService.findNotificationsAndSendUpdate(idScore);
    return hasAnyRequestChanges;
  }

  async transferScores(oldIdPlayer: number, newIdPlayer: number): Promise<void> {
    await this.scoreRepository.update({ createdByIdPlayer: oldIdPlayer }, { createdByIdPlayer: newIdPlayer });
    await this.scorePlayerService.transferScores(oldIdPlayer, newIdPlayer);
  }

  async findByIdWithAllRelations(idScore: number): Promise<Score> {
    return this.scoreRepository.findByIdWithAllRelations(idScore);
  }

  async findByIdsWithAllRelations(idScores: number[]): Promise<Score[]> {
    return this.scoreRepository.findByIdsWithAllRelations(idScores);
  }

  async findLeaderboards(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number,
    page: number,
    limit: number
  ): Promise<ScoreTopTable> {
    const [platformGameMiniGameModeStages, [scoreMap, meta]] = await Promise.all([
      this.platformGameMiniGameModeStageService.findByPlatformGameMiniGameMode(idPlatform, idGame, idMiniGame, idMode),
      this.scoreRepository.findLeaderboards(idPlatform, idGame, idMiniGame, idMode, page, limit),
    ]);
    const scoreTables: ScoreTable[] = [];
    let position = (page - 1) * limit + 1;
    for (const [idPlayer, scores] of scoreMap) {
      const player = scores
        .find(score => score)!
        .scorePlayers.find(scorePlayer => scorePlayer.idPlayer === idPlayer)!.player;
      const scoreTable = new ScoreTable();
      scoreTable.player = player;
      scoreTable.scores = platformGameMiniGameModeStages.map(platformGameMiniGameModeStage =>
        scores.find(score => score.idPlatformGameMiniGameModeStage === platformGameMiniGameModeStage.id)
      );
      scoreTable.total = scoreTable.scores.reduce((acc, score) => acc + (score?.score ?? 0), 0);
      scoreTable.position = position++;
      scoreTables.push(scoreTable);
    }
    return new ScoreTopTable(platformGameMiniGameModeStages, scoreTables, meta);
  }

  async findWorldRecordsTable(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Promise<ScoreTopTableWorldRecord> {
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
    const scoreTableWorldRecords: ScoreTableWorldRecord[] = [];
    for (const platformGameMiniGameModeCharacterCostume of platformGameMiniGameModeCharacterCostumes) {
      const scoresCharacter = scores.filter(
        score =>
          score.scorePlayers.some(
            scorePlayer =>
              scorePlayer.idPlatformGameMiniGameModeCharacterCostume === platformGameMiniGameModeCharacterCostume.id
          ) &&
          (score.scoreWorldRecords ?? []).some(
            scoreWorldRecord =>
              scoreWorldRecord.type === ScoreWorldRecordTypeEnum.CharacterWorldRecord &&
              scoreWorldRecord.scoreWorldRecordCharacters.some(
                scoreWorldRecordCharacter =>
                  scoreWorldRecordCharacter.idPlatformGameMiniGameModeCharacterCostume ===
                  platformGameMiniGameModeCharacterCostume.id
              )
          )
      );
      const scoreTable = new ScoreTableWorldRecord(
        platformGameMiniGameModeStages.map(platformGameMiniGameModeStage =>
          scoresCharacter.find(score => score.idPlatformGameMiniGameModeStage === platformGameMiniGameModeStage.id)
        )
      );
      scoreTable.idCharacter = platformGameMiniGameModeCharacterCostume.characterCostume.idCharacter;
      scoreTable.idCharacterCostume = platformGameMiniGameModeCharacterCostume.idCharacterCostume;
      scoreTable.characterName = platformGameMiniGameModeCharacterCostume.characterCostume.character.name;
      scoreTable.characterCostumeName = platformGameMiniGameModeCharacterCostume.characterCostume.name;
      scoreTable.characterCostumeShortName = platformGameMiniGameModeCharacterCostume.characterCostume.shortName;
      scoreTableWorldRecords.push(scoreTable);
    }
    // WR
    const scoreTableWorldRecord = new ScoreTableWorldRecord(
      platformGameMiniGameModeStages.map(platformGameMiniGameModeStage =>
        scores.find(
          score =>
            score.idPlatformGameMiniGameModeStage === platformGameMiniGameModeStage.id &&
            score.scoreWorldRecords.some(
              scoreWorldRecord => scoreWorldRecord.type === ScoreWorldRecordTypeEnum.WorldRecord
            )
        )
      )
    );
    scoreTableWorldRecord.idCharacter = -1;
    scoreTableWorldRecord.idCharacterCostume = -1;
    scoreTableWorldRecord.characterName = 'All';
    scoreTableWorldRecord.characterCostumeName = 'All';
    scoreTableWorldRecord.characterCostumeShortName = 'All';
    scoreTableWorldRecords.unshift(scoreTableWorldRecord);
    return new ScoreTopTableWorldRecord(
      scoreTableWorldRecords,
      platformGameMiniGameModeStages.map(platformGameMiniGameModeStage => platformGameMiniGameModeStage.stage)
    );
  }

  async findApprovalListAdmin(params: ScoreApprovalParams): Promise<ScoreApprovalPagination> {
    if (!params.idPlatform || !params.page) {
      throw new BadRequestException('idPlatform and page are required');
    }
    const pagination = await this.scoreRepository.findApprovalListAdmin(params);
    return new ScoreApprovalPagination(pagination);
  }

  async findTopScoreByIdPlatformGameMiniGameModeStage(
    idPlatformGameMiniGameModeStage: number
  ): Promise<Score | undefined> {
    return this.scoreRepository.findTopScoreByIdPlatformGameMiniGameModeStage(idPlatformGameMiniGameModeStage);
  }

  async findTopScoreByIdPlatformGameMiniGameModeStageAndCharacterCostume(
    idPlatformGameMiniGameModeStage: number,
    idPlatformGameMiniGameModeCharacterCostume: number
  ): Promise<Score | undefined> {
    return this.scoreRepository.findTopScoreByIdPlatformGameMiniGameModeStageAndCharacterCostume(
      idPlatformGameMiniGameModeStage,
      idPlatformGameMiniGameModeCharacterCostume
    );
  }

  async findTopCombinationScoreByIdPlatformGameMiniGameModeStageAndCharacterCostumes(
    idPlatformGameMiniGameModeStage: number,
    idPlatformGameMiniGameModeCharacterCostumes: number[]
  ): Promise<Score | undefined> {
    return this.scoreRepository.findTopCombinationScoreByIdPlatformGameMiniGameModeStageAndCharacterCostumes(
      idPlatformGameMiniGameModeStage,
      idPlatformGameMiniGameModeCharacterCostumes
    );
  }

  async findScoresWithChangeRequests(
    idPlayer: number,
    page: number,
    limit: number
  ): Promise<Pagination<Score, PaginationMeta>> {
    return this.scoreRepository.findScoresWithChangeRequests(idPlayer, page, limit);
  }

  async findScoreWithChangeRequests(idScore: number): Promise<Score> {
    return this.scoreRepository.findScoreWithChangeRequests(idScore);
  }

  async findApprovalAdminCount(): Promise<number> {
    return this.scoreRepository.findApprovalAdminCount();
  }

  async findScoresWithChangeRequestsCount(user: User): Promise<number> {
    const idPlayer = await this.playerService.findIdByIdUser(user.id);
    return this.scoreRepository.findScoresWithChangeRequestsCount(idPlayer);
  }

  async searchScores(dto: ScoreSearchDto, idUser: number): Promise<Pagination<Score>> {
    let idPlayer: number | undefined;
    if (dto.onlyMyScores) {
      idPlayer = await this.playerService.findIdByIdUser(idUser);
    }
    return this.scoreRepository.searchScores(dto, idPlayer);
  }

  async findRejectedAndPendingScoresByIdPlayer(idPlayer: number): Promise<ScoresGroupedByStatus[]> {
    const scores = await this.scoreRepository.findRejectedAndPendingScoresByIdPlayer(idPlayer);
    const allStatus = await this.scoreStatusService.findByIds([
      ScoreStatusEnum.AwaitingApproval,
      ScoreStatusEnum.Rejected,
    ]);
    return allStatus.map(
      status =>
        new ScoresGroupedByStatus(
          status,
          arrayRemoveMutate(scores, score => score.idScoreStatus === status.id)
        )
    );
  }

  async cancelScore(idScore: number): Promise<void> {
    const score = await this.scoreRepository.findOneOrFail(idScore);
    if (score.idScoreStatus !== ScoreStatusEnum.ChangesRequested) {
      const status = await this.scoreStatusService.findOneOrFail(ScoreStatusEnum.ChangesRequested);
      throw new BadRequestException(`Can't cancel score because the status is not ${status.description}`);
    }
    await this.scoreRepository.update(idScore, { idScoreStatus: ScoreStatusEnum.Cancelled });
  }

  async findByIds(idScores: number[]): Promise<Score[]> {
    return this.scoreRepository.findByIds(idScores);
  }

  async findById(idScore: number): Promise<Score | undefined> {
    return this.scoreRepository.findOne(idScore);
  }
}
