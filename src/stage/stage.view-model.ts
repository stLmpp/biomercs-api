import { Property } from '../mapper/property.decorator';

export class StageViewModel {
  @Property() id!: number;
  @Property() name!: string;
  @Property() shortName!: string;
}
