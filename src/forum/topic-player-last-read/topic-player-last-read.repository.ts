import { EntityRepository, Repository } from 'typeorm';
import { TopicPlayerLastRead } from './topic-player-last-read.entity';

@EntityRepository(TopicPlayerLastRead)
export class TopicPlayerLastReadRepository extends Repository<TopicPlayerLastRead> {}
