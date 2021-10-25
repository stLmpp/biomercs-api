import { PostInterface } from './post.interface';
import { Property } from '../../mapper/property.decorator';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PaginationMeta } from '../../shared/view-model/pagination.view-model';

export class PostViewModel implements PostInterface {
  @Property() id!: number;
  @Property() name!: string;
  @Property() content!: string;
  @Property() idTopic!: number;
  @Property() idPlayer!: number;
  @Property() deletedDate?: Date | null;
  @Property() personaNamePlayer!: string;
  @Property() postCount!: number;
  @Property() idRegionPlayer!: number;
  @Property() nameRegionPlayer!: string;
  @Property() shortNameRegionPlayer!: string;
  @Property() editAllowed!: boolean;
  @Property() deleteAllowed!: boolean;
  @Property() firstPost!: boolean;
}

export class PostViewModelPagination implements Pagination<PostViewModel> {
  constructor(items: PostViewModel[], meta: PaginationMeta) {
    this.items = items;
    this.meta = meta;
  }

  @Property(() => PostViewModel) items!: PostViewModel[];
  @Property(() => PaginationMeta) meta!: PaginationMeta;
}
