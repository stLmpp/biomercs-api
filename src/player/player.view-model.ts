import { PlayerInterface } from './player.interface';
import { Property } from '../mapper/property.decorator';
import { SteamProfileViewModel } from '../steam/steam-profile.view-model';
import { RegionViewModel } from '../region/region.view-model';

export class PlayerViewModel implements PlayerInterface {
  @Property() id!: number;
  @Property() aboutMe?: string;
  @Property() idRegion!: number;
  @Property() idSteamProfile?: number;
  @Property() idUser?: number;
  @Property() noUser!: boolean;
  @Property() personaName!: string;
  @Property() title?: string;
  @Property() lastUpdatedPersonaNameDate?: Date;
  @Property() idInputType?: number;
  @Property() inputTypeName?: string;
  @Property() avatar?: string | null;
}

export class PlayerWithRegionSteamProfileViewModel extends PlayerViewModel {
  @Property(() => RegionViewModel) region!: RegionViewModel;
  @Property(() => SteamProfileViewModel) steamProfile!: SteamProfileViewModel;
}
