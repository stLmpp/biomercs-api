import { SubCategoryInterface } from './sub-category.interface';
import { Property } from '../../mapper/property.decorator';
import { ModeratorViewModel } from '../moderator/moderator.view-model';
import { TopicViewModel } from '../topic/topic.view-model';

export class SubCategoryViewModel {
  @Property() id!: number;
  @Property() name!: string;
  @Property() description!: string;
  @Property() idCategory!: number;
  @Property() order!: number;
}

export class SubCategoryInfoViewModel {
  @Property() id!: number;
  @Property() playerPersonaNameLastPost?: string;
  @Property() idPlayerLastPost?: number;
  @Property() topicNameLastPost?: string;
  @Property() idTopicLastPost?: number;
  @Property() lastPostDate?: Date;
  @Property() topicCount!: number;
  @Property() postCount!: number;
  @Property() hasNewPosts!: boolean;
  @Property() isModerator!: boolean;
}

export class SubCategoryWithInfoViewModel extends SubCategoryInfoViewModel implements SubCategoryInterface {
  @Property() name!: string;
  @Property() description!: string;
  @Property() idCategory!: number;
  @Property() order!: number;
}

export class SubCategoryWithModeratorsViewModel extends SubCategoryWithInfoViewModel {
  @Property(() => ModeratorViewModel) moderators!: ModeratorViewModel[];
}

export class SubCategoryWithTopicsViewModel extends SubCategoryWithInfoViewModel {
  @Property(() => TopicViewModel) topics!: TopicViewModel[];
}