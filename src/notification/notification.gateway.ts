import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { InjectMapProfile } from '../mapper/inject-map-profile';
import { Notification } from './notification.entity';
import { MapProfile } from '../mapper/map-profile';
import { NotificationViewModel } from './notification.view-model';
import { groupBy } from 'st-utils';

@WebSocketGateway({ namespace: '/notification' })
export class NotificationGateway {
  constructor(
    @InjectMapProfile(Notification, NotificationViewModel)
    private mapProfile: MapProfile<Notification, NotificationViewModel>
  ) {}

  @WebSocketServer() server!: Server;

  sendNotification(notification: Notification): void {
    this.server.emit(`${notification.idUser}`, [this.mapProfile.map(notification)]);
  }

  sendNotifications(notifications: Notification[]): void {
    const notificationsMapped = this.mapProfile.map(notifications);
    const notificationGroupedByUser = groupBy(notificationsMapped, 'idUser', 'map');
    for (const [idUser, userNotifications] of notificationGroupedByUser) {
      this.server.emit(`${idUser}`, userNotifications);
    }
  }
}
