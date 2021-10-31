import { EntityRepository, Repository } from 'typeorm';
import { PostHistory } from './post-history.entity';

@EntityRepository(PostHistory)
export class PostHistoryRepository extends Repository<PostHistory> {}
