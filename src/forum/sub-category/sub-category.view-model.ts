import { SubCategoryInterface } from './sub-category.interface';
import { Property } from '../../mapper/property.decorator';
import { ModeratorViewModel } from '../moderator/moderator.view-model';

export class SubCategoryViewModel implements SubCategoryInterface {
  @Property() id!: number;
  @Property() name!: string;
  @Property() description!: string;
  @Property() idCategory!: number;
  @Property() playerPersonaNameLastPost?: string;
  @Property() idPlayerLastPost?: number;
  @Property() topicNameLastPost?: string;
  @Property() idTopicLastPost?: number;
  @Property() lastPostDate?: Date;
  @Property() topicCount!: number;
  @Property() postCount!: number;
  @Property(() => ModeratorViewModel) moderators!: ModeratorViewModel[];
}
