import {
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthSteamLoginSocketViewModel } from './auth.view-model';
import { UserOnlineViewModel } from '../user/user.view-model';
import { JwtService } from '@nestjs/jwt';
import { isNumber, isObject, isString } from 'st-utils';

export enum AuthGatewayEvents {
  loginSteam = 'login-steam',
  userOnline = 'user-online',
  userOffline = 'user-offline',
}

@WebSocketGateway({ namespace: '/auth' })
export class AuthGateway implements OnGatewayDisconnect {
  constructor(private jwtService: JwtService) {}

  @WebSocketServer() server!: Server;

  @SubscribeMessage(AuthGatewayEvents.userOffline)
  sendUserOffline(@MessageBody() idUser: number): void {
    this.server.emit(AuthGatewayEvents.userOffline, idUser);
  }

  sendTokenSteam(viewModel: AuthSteamLoginSocketViewModel): void {
    this.server.emit(AuthGatewayEvents.loginSteam + viewModel.uuid, viewModel);
  }

  sendUserOnline(viewModel: UserOnlineViewModel): void {
    this.server.emit(AuthGatewayEvents.userOnline, viewModel);
  }

  handleDisconnect(client: Socket): any {
    const token = client.handshake.query.token;
    if (!isString(token)) {
      return;
    }
    const payload = this.jwtService.decode(token);
    if (!payload || !isObject(payload) || !payload.id || !isNumber(payload.id)) {
      return;
    }
    this.sendUserOffline(payload.id);
  }
}
