import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class AuthGateway {
  private _logger: Logger = new Logger('AuthGateway');

  @WebSocketServer() server!: Server;

  sendTokenSteam(uuid: string, token: string, error?: string): void {
    this.server.emit('logged-steam', { uuid, token, error });
  }

  afterInit(server: Server): void {
    this._logger.log('Init');
  }

  handleDisconnect(client: Socket): void {
    this._logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]): void {
    this._logger.log(`Client connected: ${client.id}`);
  }
}
