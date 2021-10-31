import { Property } from '../../mapper/property.decorator';

export class SubCategoryModeratorViewModel {
  @Property() id!: number;
  @Property() idSubCategory!: number;
  @Property() idModerator!: number;
  @Property() idPlayer!: number;
  @Property() playerPersonaName!: string;
}
