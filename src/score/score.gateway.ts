import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { environment } from '../environment/environment';

export enum ScoreGatewayEvents {
  updateCountApprovals = 'updateCountApprovals',
}

@WebSocketGateway({ path: environment.websocketPath, transports: environment.websocketTransports, namespace: '/score' })
export class ScoreGateway {
  @WebSocketServer() server!: Server;

  updateCountApprovals(): void {
    this.server.emit(ScoreGatewayEvents.updateCountApprovals);
  }
}
