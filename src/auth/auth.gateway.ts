import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthSteamLoginSocketViewModel } from './auth.view-model';
import { environment } from '../environment/environment';

export enum AuthGatewayEvents {
  loginSteam = 'login-steam',
}

@WebSocketGateway({ path: environment.websocketPath, transports: environment.websocketTransports, namespace: '/auth' })
export class AuthGateway {
  @WebSocketServer() server!: Server;

  sendTokenSteam(viewModel: AuthSteamLoginSocketViewModel): void {
    this.server.emit(AuthGatewayEvents.loginSteam + viewModel.uuid, viewModel);
  }
}
