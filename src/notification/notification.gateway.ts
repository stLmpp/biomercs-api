import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { InjectMapProfile } from '../mapper/inject-map-profile';
import { Notification } from './notification.entity';
import { MapProfile } from '../mapper/map-profile';
import { NotificationViewModel } from './notification.view-model';

@WebSocketGateway({ namespace: '/notification' })
export class NotificationGateway {
  constructor(
    @InjectMapProfile(Notification, NotificationViewModel)
    private mapProfile: MapProfile<Notification, NotificationViewModel>
  ) {}

  @WebSocketServer() server!: Server;

  sendNotification(notification: Notification): void {
    this.server.emit(`${notification.idUser}`, this.mapProfile.map(notification));
  }
}
