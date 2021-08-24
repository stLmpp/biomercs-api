import { Injectable } from '@nestjs/common';
import { TopicTransferRepository } from './topic-transfer.repository';

@Injectable()
export class TopicTransferService {
  constructor(private topicTransferRepository: TopicTransferRepository) {}
}
