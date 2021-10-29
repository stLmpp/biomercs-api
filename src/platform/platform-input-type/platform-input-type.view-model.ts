import { PlatformInputTypeInterface } from './platform-input-type.interface';
import { Property } from '../../mapper/property.decorator';

export class PlatformInputTypeViewModel implements PlatformInputTypeInterface {
  @Property() id!: number;
  @Property() idInputType!: number;
  @Property() idPlatform!: number;
  @Property() nameInputType!: string;
}
