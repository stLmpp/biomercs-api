import { PostInterface } from './post.interface';
import { Property } from '../../mapper/property.decorator';

export class PostViewModel implements PostInterface {
  @Property() id!: number;
  @Property() name!: string;
  @Property() post!: string;
  @Property() idTopic!: number;
  @Property() idPlayer!: number;
  @Property() deletedDate?: Date | null;
}
