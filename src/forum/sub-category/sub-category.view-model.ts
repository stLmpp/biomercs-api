import { SubCategoryInterface } from './sub-category.interface';
import { Property } from '../../mapper/property.decorator';
import { ModeratorViewModel } from '../moderator/moderator.view-model';
import { TopicViewModelPaginated } from '../topic/topic.view-model';

export class SubCategoryViewModel implements SubCategoryInterface {
  @Property() id!: number;
  @Property() name!: string;
  @Property() description!: string;
  @Property() idCategory!: number;
  @Property() order!: number;
  @Property() deletedDate?: Date | null;
}

export class SubCategoryWithInfoViewModel extends SubCategoryViewModel {
  @Property() playerPersonaNameLastPost?: string;
  @Property() idPlayerLastPost?: number;
  @Property() topicNameLastPost?: string;
  @Property() idTopicLastPost?: number;
  @Property() lastPostDate?: Date;
  @Property() topicCount!: number;
  @Property() postCount!: number;
  @Property() hasNewPosts!: boolean;
  @Property() isModerator!: boolean;
  @Property() idLastPost?: number;
  @Property() lastPostName?: string;
}

export class SubCategoryWithInfoModeratorsViewModel extends SubCategoryWithInfoViewModel {
  @Property(() => ModeratorViewModel) moderators!: ModeratorViewModel[];
}

export class SubCategoryWithInfoModeratorsTopicsViewModel extends SubCategoryWithInfoModeratorsViewModel {
  constructor(partial?: Partial<SubCategoryWithInfoModeratorsTopicsViewModel>) {
    super();
    Object.assign(this, partial);
  }

  @Property(() => TopicViewModelPaginated) topics!: TopicViewModelPaginated;
}
