import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { Notification } from './notification.entity';
import { NotificationAddDto } from './notification.dto';
import { NotificationGateway } from './notification.gateway';
import { NotificationTypeService } from './notification-type/notification-type.service';
import { NotificationType } from './notification-type/notification-type.entity';

@Injectable()
export class NotificationService {
  constructor(
    private notificationRepository: NotificationRepository,
    private notificationGateway: NotificationGateway,
    private notificationTypeService: NotificationTypeService
  ) {}

  async addAndSend(dto: NotificationAddDto): Promise<void> {
    if (!dto.content && !dto.idNotificationType) {
      throw new BadRequestException('content or idNotificationType is required');
    }
    if (dto.idNotificationType) {
      const notificationType = await this.notificationTypeService.findById(dto.idNotificationType);
      dto.content = notificationType.content;
    }
    const { id } = await this.notificationRepository.save(dto);
    const notification = await this.notificationRepository.findOneWithAllRelations(id);
    this.notificationGateway.sendNotification(notification);
  }

  async addAndSendMany(dtos: NotificationAddDto[]): Promise<void> {
    if (dtos.some(dto => !dto.content && !dto.idNotificationType)) {
      throw new BadRequestException('content or idNotificationType is required');
    }
    const dtosWithIdNotificationType = dtos.filter(dto => dto.idNotificationType);
    let notificationTypes: NotificationType[] = [];
    if (dtosWithIdNotificationType.length) {
      notificationTypes = await this.notificationTypeService.findByIds(
        dtosWithIdNotificationType.map(dto => dto.idNotificationType!)
      );
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
        return dto;
      })
      .filter(dto => dto.idNotificationType || dto.content);
    const idNotifications = await this.notificationRepository
      .save(newDtos)
      .then(notifications => notifications.map(notification => notification.id));
    const notifications = await this.notificationRepository.findIdsWithAllRelations(idNotifications);
    for (const notification of notifications) {
      this.notificationGateway.sendNotification(notification);
    }
  }

  async read(idNotification: number): Promise<void> {
    await this.notificationRepository.update(idNotification, { read: true });
  }

  async readAll(idUser: number): Promise<void> {
    await this.notificationRepository.update({ read: false, idUser }, { read: true });
  }

  async get(idUser: number, page: number, limit: number): Promise<Notification[]> {
    return this.notificationRepository.findPaginated(idUser, page, limit).then(pagination => pagination.items);
  }
}
