import { PlayerInterface } from './player.interface';
import { Region } from '../region/region.entity';
import { Property } from '../mapper/property.decorator';

export class PlayerViewModel implements PlayerInterface {
  @Property() id!: number;
  @Property() aboutMe?: string;
  @Property() idRegion!: number;
  @Property() idSteamProfile?: number;
  @Property() idUser?: number;
  @Property() noUser!: boolean;
  @Property() personaName!: string;
  @Property() title?: string;
}

export class PlayerWithRegionViewModel extends PlayerViewModel {
  @Property(() => Region) region?: Region;
}
