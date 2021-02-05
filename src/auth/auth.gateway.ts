import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { AuthSteamLoginSocketViewModel } from './auth.view-model';

export enum AuthSteamLoginSocketEvent {
  eventName = 'logged-steam',
  namespace = 'auth',
}

@WebSocketGateway({ namespace: `/${AuthSteamLoginSocketEvent.namespace}` })
export class AuthGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private _logger: Logger = new Logger('AuthGateway');

  @WebSocketServer() server!: Server;

  sendTokenSteam(viewModel: AuthSteamLoginSocketViewModel): void {
    this.server.emit(AuthSteamLoginSocketEvent.eventName, viewModel);
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
