import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SteamPlayerLinkedSocket, SteamPlayerLinkedSocketViewModel } from './steam-player-linked.view-model';
import { InjectMapProfile } from '../mapper/inject-map-profile';
import { MapProfile } from '../mapper/map-profile';

export enum SteamGatewayEvents {
  playerLinked = 'player-linked',
}

@WebSocketGateway({ namespace: '/steam' })
export class SteamGateway {
  constructor(
    @InjectMapProfile(SteamPlayerLinkedSocket, SteamPlayerLinkedSocketViewModel)
    private mapProfileSteamPlayerLinkedSocket: MapProfile<SteamPlayerLinkedSocket, SteamPlayerLinkedSocketViewModel>
  ) {}

  @WebSocketServer() server!: Server;

  playerLinked(idPlayer: number, steamPlayerLinkedSocket: SteamPlayerLinkedSocket): void {
    this.server.emit(
      SteamGatewayEvents.playerLinked + idPlayer,
      this.mapProfileSteamPlayerLinkedSocket.map(steamPlayerLinkedSocket)
    );
  }
}
