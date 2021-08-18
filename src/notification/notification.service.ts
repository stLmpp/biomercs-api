import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { Notification } from './notification.entity';
import { NotificationAddDto } from './notification.dto';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    private notificationRepository: NotificationRepository,
    private notificationGateway: NotificationGateway
  ) {}

  async addAndSend(dto: NotificationAddDto): Promise<void> {
    const { id } = await this.notificationRepository.save(dto);
    const notification = await this.notificationRepository.findOneWithAllRelations(id);
    this.notificationGateway.sendNotification(notification);
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
