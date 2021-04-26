import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthSteamLoginSocketViewModel } from './auth.view-model';

export enum AuthGatewayEvents {
  loginSteam = 'loginSteam',
}

@WebSocketGateway({ namespace: `auth` })
export class AuthGateway {
  @WebSocketServer() server!: Server;

  sendTokenSteam(viewModel: AuthSteamLoginSocketViewModel): void {
    this.server.emit(AuthGatewayEvents.loginSteam + viewModel.uuid, viewModel);
  }
}
