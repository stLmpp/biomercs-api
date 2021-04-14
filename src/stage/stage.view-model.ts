import { Property } from '../mapper/mapper.service';

export class StageViewModel {
  @Property() id!: number;
  @Property() name!: string;
  @Property() shortName!: string;
}
