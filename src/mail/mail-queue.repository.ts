import { EntityRepository, Repository } from 'typeorm';
import { MailQueue } from './mail-queue.entity';

@EntityRepository(MailQueue)
export class MailQueueRepository extends Repository<MailQueue> {}
