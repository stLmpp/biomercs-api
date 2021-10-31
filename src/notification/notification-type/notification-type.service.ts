import { Injectable } from '@nestjs/common';
import { NotificationTypeRepository } from './notification-type.repository';
import { NotificationTypeEnum } from './notification-type.enum';
import { NotificationType } from './notification-type.entity';

@Injectable()
export class NotificationTypeService {
  constructor(private notificationTypeRepository: NotificationTypeRepository) {}

  async findContentById(idNotificationType: NotificationTypeEnum): Promise<string> {
    return this.notificationTypeRepository
      .findOneOrFail(idNotificationType, { select: ['content'] })
      .then(({ content }) => content);
  }

  async findByIds(idNotificationTypes: NotificationTypeEnum[]): Promise<NotificationType[]> {
    return this.notificationTypeRepository.findByIds(idNotificationTypes);
  }
}
