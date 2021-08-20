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

@Injectable()
export class NotificationService {
  constructor(
    private notificationRepository: NotificationRepository,
    private notificationGateway: NotificationGateway,
    private notificationTypeService: NotificationTypeService,
    @Inject(forwardRef(() => ScoreService)) private scoreService: ScoreService
  ) {}

  async addAndSend(dto: NotificationAddDto): Promise<void> {
    if (!dto.content && !dto.idNotificationType) {
      throw new BadRequestException('content or idNotificationType is required');
    }
    if (dto.idNotificationType) {
      const notificationType = await this.notificationTypeService.findById(dto.idNotificationType);
      dto.content = notificationType.content;
    }
    if (dto.idScore) {
      const score = await this.scoreService.findByIdWithAllRelations(dto.idScore);
      dto.content = `${dto.content}\n${fromScoreToName(score)}`;
    }
    const { id } = await this.notificationRepository.save(dto);
    const notification = await this.notificationRepository.findOneOrFail(id, { relations: ['score'] });
    this.notificationGateway.sendNotification(notification);
  }

  async addAndSendMany(dtos: NotificationAddDto[]): Promise<void> {
    if (dtos.some(dto => !dto.content && !dto.idNotificationType)) {
      throw new BadRequestException('content or idNotificationType is required');
    }
    const dtosWithIdScore: (NotificationAddDto & { idScore: number })[] = [];
    const dtosWithIdNotificationType: (NotificationAddDto & { idNotificationType: number })[] = [];
    for (const dto of dtos) {
      if (dto.idScore) {
        dtosWithIdScore.push({ ...dto, idScore: dto.idScore });
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
        if (dto.idScore) {
          const score = scores.find(_score => _score.id === dto.idScore);
          if (score) {
            dto.content = `${dto.content}\n${fromScoreToName(score)}`;
          }
        }
        return dto;
      })
      .filter(dto => dto.idNotificationType || dto.content);
    const notificationsSaved = await this.notificationRepository.save(newDtos);
    const idNotifications = notificationsSaved.map(notification => notification.id);
    const notifications = await this.notificationRepository.findByIds(idNotifications, { relations: ['score'] });
    for (const notification of notifications) {
      this.notificationGateway.sendNotification(notification);
    }
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

  async get(idUser: number, page: number, limit: number): Promise<Pagination<Notification>> {
    return this.notificationRepository.paginate(
      { page, limit },
      { where: { idUser }, order: { id: 'DESC' }, relations: ['score'] }
    );
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
    const notifications = await this.notificationRepository.find({ where: { idScore }, relations: ['score'] });
    this.notificationGateway.sendNotifications(notifications);
  }
}
