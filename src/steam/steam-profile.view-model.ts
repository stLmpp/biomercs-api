import { SteamProfileInterface } from './steam-profile.interface';
import { PlayerViewModel } from '../player/player.view-model';
import { Property } from '../mapper/property.decorator';

export class SteamProfileViewModel implements SteamProfileInterface {
  @Property() id!: number;
  @Property() steamid!: string;
  @Property() communityvisibilitystate!: number;
  @Property() profilestate!: number;
  @Property() personaname!: string;
  @Property() profileurl!: string;
  @Property() avatar!: string;
  @Property() avatarmedium!: string;
  @Property() avatarfull!: string;
  @Property() avatarhash!: string;
  @Property() lastlogoff!: number;
  @Property() personastate!: number;
  @Property() realname?: string;
  @Property() primaryclanid?: string;
  @Property() timecreated?: number;
  @Property() personastateflags!: number;
  @Property() gameextrainfo?: string;
  @Property() gameid?: string;
  @Property() loccountrycode?: string;
}

export class SteamProfileWithPlayerViewModel extends SteamProfileViewModel {
  @Property(() => PlayerViewModel) player!: PlayerViewModel;
}

export class SteamPlayerLinkedSocketViewModel {
  @Property(() => SteamProfileViewModel) steamProfile?: SteamProfileViewModel;
  @Property() error?: string;
}
