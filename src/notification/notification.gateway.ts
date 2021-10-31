import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NotificationViewModel } from './notification.view-model';
import { groupBy } from 'st-utils';

@WebSocketGateway({ namespace: '/notification' })
export class NotificationGateway {
  @WebSocketServer() server!: Server;

  sendNotification(notification: NotificationViewModel): void {
    this.server.emit(`${notification.idUser}`, [notification]);
  }

  sendNotifications(notifications: NotificationViewModel[]): void {
    const notificationGroupedByUser = groupBy(notifications, 'idUser', 'map');
    for (const [idUser, userNotifications] of notificationGroupedByUser) {
      this.server.emit(`${idUser}`, userNotifications);
    }
  }
}
