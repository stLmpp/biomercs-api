import { PostContent } from './post-content.view-model';

export interface PostInterface {
  id: number;
  content: PostContent;
  idTopic: number;
  idPlayer: number;
  deletedDate?: Date | null;
}
