import { GameInterface } from './game.interface';
import { Property } from '../mapper/property.decorator';

export class GameViewModel implements GameInterface {
  @Property() id!: number;
  @Property() name!: string;
  @Property() shortName!: string;
}
