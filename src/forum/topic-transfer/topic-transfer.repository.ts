import { EntityRepository, Repository } from 'typeorm';
import { TopicTransfer } from './topic-transfer.entity';

@EntityRepository(TopicTransfer)
export class TopicTransferRepository extends Repository<TopicTransfer> {}
