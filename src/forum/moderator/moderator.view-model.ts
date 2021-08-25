import { ModeratorInterface } from './moderator.interface';
import { Property } from '../../mapper/property.decorator';

export class ModeratorViewModel implements ModeratorInterface {
  @Property() id!: number;
  @Property() idPlayer!: number;
  @Property() playerPersonaName!: string;
}

export class ModeratorViewModelWithInfo extends ModeratorViewModel {
  @Property() deleteAllowed!: boolean;
}
