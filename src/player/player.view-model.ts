import { PlayerInterface } from './player.interface';
import { Property } from '../mapper/mapper.service';
import { Region } from '../region/region.entity';

export class PlayerViewModel implements PlayerInterface {
  @Property() aboutMe?: string;
  @Property() idRegion!: number;
  @Property() idSteamProfile?: number;
  @Property() idUser?: number;
  @Property() noUser!: boolean;
  @Property() personaName!: string;
  @Property() title?: string;
}

export class PlayerWithRegionViewModel extends PlayerViewModel {
  @Property() region?: Region;
}
