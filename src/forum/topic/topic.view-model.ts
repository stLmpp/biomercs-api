import { TopicInterface } from './topic.interface';
import { Property } from '../../mapper/property.decorator';
import { PostViewModel } from '../post/post.view-model';

export class TopicViewModel implements TopicInterface {
  @Property() id!: number;
  @Property() name!: string;
  @Property() idSubCategory!: number;
  @Property() idScore?: number | null;
  @Property() views!: number;
  @Property() pinned!: boolean;
  @Property() lockedDate?: Date | null;
  @Property() personaNameLastPost!: string;
  @Property() lastPostDate!: Date;
  @Property() repliesCount!: number;
  @Property() hasNewPosts!: boolean;
}

export class TopicWithPostsViewModel extends TopicViewModel {
  @Property(() => PostViewModel) posts!: PostViewModel[];
}
