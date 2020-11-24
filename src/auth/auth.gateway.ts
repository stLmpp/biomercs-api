import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: '/auth' })
export class AuthGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private _logger: Logger = new Logger('AuthGateway');

  @WebSocketServer() server!: Server;

  sendTokenSteam(uuid: string, token: string, error?: string): void {
    this.server.emit('logged-steam', { token, error, uuid });
  }

  afterInit(): void {
    this._logger.log('Init');
  }

  handleDisconnect(client: Socket): void {
    this._logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket): void {
    this._logger.log(`Client connected: ${client.id}`);
  }
}
