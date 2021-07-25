import { RegionInterface } from './region.interface';
import { Property } from '../mapper/property.decorator';

export class RegionViewModel implements RegionInterface {
  @Property() id!: number;
  @Property() name!: string;
  @Property() shortName!: string;
}
