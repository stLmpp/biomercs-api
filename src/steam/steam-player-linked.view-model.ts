import { Property } from '../mapper/property.decorator';
import { SteamProfile } from './steam-profile.entity';
import { SteamProfileViewModel } from './steam-profile.view-model';

export class SteamPlayerLinkedSocket {
  @Property(() => SteamProfile) steamProfile?: SteamProfile;
  @Property() error?: string;
}

export class SteamPlayerLinkedSocketViewModel {
  @Property(() => SteamProfileViewModel) steamProfile?: SteamProfileViewModel;
  @Property() error?: string;
}
