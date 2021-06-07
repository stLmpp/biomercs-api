import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { environment } from '../environment/environment';
import { Server } from 'socket.io';
import { SteamPlayerLinkedSocketViewModel } from './steam-profile.view-model';

export enum SteamGatewayEvents {
  playerLinked = 'player-linked',
}

@WebSocketGateway({ path: environment.websocketPath, transports: environment.websocketTransports, namespace: '/steam' })
export class SteamGateway {
  @WebSocketServer() server!: Server;

  playerLinked(idPlayer: number, viewModel: SteamPlayerLinkedSocketViewModel): void {
    this.server.emit(SteamGatewayEvents.playerLinked + idPlayer, viewModel);
  }
}
