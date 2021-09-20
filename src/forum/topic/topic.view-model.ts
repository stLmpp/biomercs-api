import { TopicInterface } from './topic.interface';
import { Property } from '../../mapper/property.decorator';
import { PostViewModel } from '../post/post.view-model';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PaginationMeta } from '../../shared/view-model/pagination.view-model';

export class TopicViewModel implements TopicInterface {
  @Property() id!: number;
  @Property() name!: string;
  @Property() idSubCategory!: number;
  @Property() idScore?: number | null;
  @Property() idPlayer!: number;
  @Property() playerPersonaName!: string;
  @Property() views!: number;
  @Property() pinned!: boolean;
  @Property() lockedDate?: Date | null;
  @Property() idPlayerLastPost!: number;
  @Property() playerPersonaNameLastPost!: string;
  @Property() lastPostDate!: Date;
  @Property() repliesCount!: number;
  @Property() idLastPost!: number;
  @Property() nameLastPost!: string;
  @Property() hasNewPosts!: boolean;
  @Property() creationDate!: Date;
}

export class TopicWithPostsViewModel extends TopicViewModel {
  @Property(() => PostViewModel) posts!: PostViewModel[];
}

export class TopicViewModelPaginated implements Pagination<TopicViewModel> {
  constructor(items: TopicViewModel[], meta: PaginationMeta) {
    this.items = items;
    this.meta = meta;
  }

  @Property(() => TopicViewModel) items!: TopicViewModel[];
  @Property(() => PaginationMeta) meta!: PaginationMeta;
}

export class TopicRecentViewModel {
  @Property() id!: number;
  @Property() name!: string;
  @Property() idPost!: number;
  @Property() postName!: string;
  @Property() postDate!: Date;
  @Property() idCategory!: number;
  @Property() idSubCategory!: number;
  @Property() nameSubCategory!: string;
  @Property() idPlayer!: number;
  @Property() playerPersonaName!: string;
}
