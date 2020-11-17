import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class AuthGateway {
  @WebSocketServer() server!: Server;

  private logger: Logger = new Logger('AuthGateway');

  sendTokenSteam(uuid: string, token: string): void {
    this.server.emit('logged-steam', { uuid, token });
  }

  afterInit(server: Server): void {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]): void {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
