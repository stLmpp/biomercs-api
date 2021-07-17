import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

export enum ScoreGatewayEvents {
  updateCountApprovals = 'updateCountApprovals',
}

@WebSocketGateway({ namespace: '/score' })
export class ScoreGateway {
  @WebSocketServer() server!: Server;

  updateCountApprovals(): void {
    this.server.emit(ScoreGatewayEvents.updateCountApprovals);
  }
}
