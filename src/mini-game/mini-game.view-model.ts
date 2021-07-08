import { MiniGameInterface } from './mini-game.interface';
import { Property } from '../mapper/property.decorator';

export class MiniGameViewModel implements MiniGameInterface {
  @Property() id!: number;
  @Property() name!: string;
}
