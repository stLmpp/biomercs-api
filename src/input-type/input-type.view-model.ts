import { InputTypeInterface } from './input-type.interface';
import { Property } from '../mapper/property.decorator';

export class InputTypeViewModel implements InputTypeInterface {
  @Property() id!: number;
  @Property() name!: string;
}
