import { ModeInterface } from './mode.interface';
import { Property } from '../mapper/property.decorator';

export class ModeViewModel implements ModeInterface {
  @Property() id!: number;
  @Property() name!: string;
  @Property() playerQuantity!: number;
}
