import { PlatformInterface } from './platform.interface';
import { Property } from '../mapper/property.decorator';

export class PlatformViewModel implements PlatformInterface {
  @Property() id!: number;
  @Property() name!: string;
  @Property() shortName!: string;
}
