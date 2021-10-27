import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { Notification } from './notification.entity';
import { NotificationAddDto } from './notification.dto';
import { NotificationGateway } from './notification.gateway';
import { NotificationTypeService } from './notification-type/notification-type.service';
import { NotificationType } from './notification-type/notification-type.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ScoreService } from '../score/score.service';
import { fromScoreToName } from '../score/shared';
import { Score } from '../score/score.entity';
import { IsNull } from 'typeorm';
import { NotificationExtraPost, NotificationExtraScore } from './notification-extra.view-model';
import { NotificationViewModel } from './notification.view-model';
import { isNotNil } from 'st-utils';
import { InjectMapProfile } from '../mapper/inject-map-profile';
import { MapProfile } from '../mapper/map-profile';
import { Json } from '../util/find-operator';
import { Topic } from '../forum/topic/topic.entity';
import { TopicService } from '../forum/topic/topic.service';

@Injectable()
export class NotificationService {
  constructor(
    private notificationRepository: NotificationRepository,
    private notificationGateway: NotificationGateway,
    private notificationTypeService: NotificationTypeService,
    @Inject(forwardRef(() => ScoreService)) private scoreService: ScoreService,
    @InjectMapProfile(Notification, NotificationViewModel)
    private mapProfile: MapProfile<Notification, NotificationViewModel>,
    @Inject(forwardRef(() => TopicService)) private topicService: TopicService
  ) {}

  private async _getViewModelById(idNotification: number): Promise<NotificationViewModel> {
    const notification = await this.notificationRepository.findOneOrFail(idNotification);
    if (notification.extra && NotificationExtraScore.is(notification.extra)) {
      const idScore = notification.extra.idScore;
      const score = await this.scoreService.findById(idScore);
      if (score) {
        notification.extra.idScoreStatus = score.idScoreStatus;
      }
    }
    return this.mapProfile.map(notification);
  }

  private async _getViewModelByIds(idNotifications: number[]): Promise<NotificationViewModel[]> {
    const notifications = await this._completeWithScore(await this.notificationRepository.findByIds(idNotifications));
    return this.mapProfile.map(notifications);
  }

  private async _completeWithScore(notifications: Notification[]): Promise<Notification[]> {
    const idScores = notifications
      .map(notification =>
        notification.extra && NotificationExtraScore.is(notification.extra) ? notification.extra.idScore : null
      )
      .filter(isNotNil);
    if (idScores.length) {
      const scores = await this.scoreService.findByIds(idScores);
      for (const notification of notifications) {
        if (notification.extra && NotificationExtraScore.is(notification.extra)) {
          const idScore = notification.extra.idScore;
          const score = scores.find(_score => _score.id === idScore);
          if (score) {
            notification.extra.idScoreStatus = score.idScoreStatus;
          }
        }
      }
    }
    return notifications;
  }

  async addAndSend(dto: NotificationAddDto): Promise<void> {
    if (!dto.content && !dto.idNotificationType) {
      throw new BadRequestException('"content" or "idNotificationType" is required');
    }
    if (dto.idNotificationType) {
      dto.content = await this.notificationTypeService.findContentById(dto.idNotificationType);
    }
    if (dto.extra) {
      if (NotificationExtraScore.is(dto.extra)) {
        const score = await this.scoreService.findByIdWithAllRelations(dto.extra.idScore);
        dto.content = `${dto.content}\n${fromScoreToName(score)}`;
      }
      if (NotificationExtraPost.is(dto.extra)) {
        const topic = await this.topicService.findById(dto.extra.idTopic);
        dto.content = `${dto.content}\n${topic.name}`;
      }
    }
    const { id } = await this.notificationRepository.save(dto);
    const notification = await this._getViewModelById(id);
    this.notificationGateway.sendNotification(notification);
  }

  async addAndSendMany(dtos: NotificationAddDto[]): Promise<void> {
    if (dtos.some(dto => !dto.content && !dto.idNotificationType)) {
      throw new BadRequestException('content or idNotificationType is required');
    }
    const dtosWithIdScore: (NotificationAddDto & { idScore: number })[] = [];
    const dtosWithIdNotificationType: (NotificationAddDto & { idNotificationType: number })[] = [];
    const dtosWithIdTopic: (NotificationAddDto & { idTopic: number })[] = [];
    for (const dto of dtos) {
      if (dto.extra) {
        if (NotificationExtraScore.is(dto.extra)) {
          dtosWithIdScore.push({ ...dto, idScore: dto.extra.idScore });
        }
        if (NotificationExtraPost.is(dto.extra)) {
          dtosWithIdTopic.push({ ...dto, idTopic: dto.extra.idTopic });
        }
      }
      if (dto.idNotificationType) {
        dtosWithIdNotificationType.push({ ...dto, idNotificationType: dto.idNotificationType });
      }
    }
    let notificationTypes: NotificationType[] = [];
    if (dtosWithIdNotificationType.length) {
      notificationTypes = await this.notificationTypeService.findByIds(
        dtosWithIdNotificationType.map(dto => dto.idNotificationType)
      );
    }
    let scores: Score[] = [];
    if (dtosWithIdScore.length) {
      scores = await this.scoreService.findByIdsWithAllRelations(dtosWithIdScore.map(dto => dto.idScore));
    }
    let topics: Topic[] = [];
    if (dtosWithIdTopic) {
      topics = await this.topicService.findByIds(dtosWithIdTopic.map(dto => dto.idTopic));
    }
    const newDtos = dtos
      .map(dto => {
        if (dto.idNotificationType) {
          const notificationType = notificationTypes.find(
            _notificationType => _notificationType.id === dto.idNotificationType
          );
          if (notificationType) {
            dto.content = notificationType.content;
          }
        }
        if (dto.extra) {
          if (NotificationExtraScore.is(dto.extra)) {
            const { idScore } = dto.extra;
            const score = scores.find(_score => _score.id === idScore);
            if (score) {
              dto.content = `${dto.content}\n${fromScoreToName(score)}`;
            }
          }
          if (NotificationExtraPost.is(dto.extra)) {
            const { idTopic } = dto.extra;
            const topic = topics.find(_topic => _topic.id === idTopic);
            if (topic) {
              dto.content = `${dto.content}\n${topic.name}`;
            }
          }
        }
        return dto;
      })
      .filter(dto => dto.idNotificationType || dto.content);
    const notificationsSaved = await this.notificationRepository.save(newDtos);
    const idNotifications = notificationsSaved.map(notification => notification.id);
    const notifications = await this._getViewModelByIds(idNotifications);
    this.notificationGateway.sendNotifications(notifications);
  }

  async read(idNotification: number): Promise<number> {
    await this.notificationRepository.update(idNotification, { read: true });
    const { idUser } = await this.notificationRepository.findOneOrFail(idNotification, { select: ['idUser'] });
    return this.unseenCount(idUser);
  }

  async readAll(idUser: number): Promise<number> {
    await this.notificationRepository.update({ read: false, idUser }, { read: true });
    return this.unseenCount(idUser);
  }

  async findByIdUserPaginated(idUser: number, page: number, limit: number): Promise<Pagination<NotificationViewModel>> {
    const { items, meta } = await this.notificationRepository.paginate(
      { page, limit },
      { where: { idUser }, order: { id: 'DESC' } }
    );
    const notifications = await this._completeWithScore(items);
    return new Pagination<NotificationViewModel>(this.mapProfile.map(notifications), meta);
  }

  async unreadCount(idUser: number): Promise<number> {
    return this.notificationRepository.count({ where: { idUser, read: false } });
  }

  async unseenCount(idUser: number): Promise<number> {
    return this.notificationRepository.count({ where: { idUser, seen: false } });
  }

  async seenAll(idUser: number): Promise<void> {
    await this.notificationRepository.update({ seen: false, idUser }, { seen: true });
  }

  async unread(idNotification: number): Promise<void> {
    await this.notificationRepository.update(idNotification, { read: false });
  }

  async findNotificationsAndSendUpdate(idScore: number): Promise<void> {
    const notifications = await this.notificationRepository.find({
      where: { extra: Json('idScore', '' + idScore) },
    });
    const notificationsWithScore = await this._completeWithScore(notifications);
    this.notificationGateway.sendNotifications(this.mapProfile.map(notificationsWithScore));
  }

  async delete(idNotification: number): Promise<void> {
    await this.notificationRepository.softDelete(idNotification);
  }

  async deleteAll(idUser: number): Promise<void> {
    await this.notificationRepository.softDelete({ idUser, deletedDate: IsNull() });
  }
}
