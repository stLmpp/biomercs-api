import { Injectable } from '@nestjs/common';
import { TopicTransferRepository } from './topic-transfer.repository';

@Injectable()
export class TopicTransferService {
  constructor(private topicTransferRepository: TopicTransferRepository) {}

  async add(idTopic: number, idSubCategoryFrom: number, idSubCategoryTo: number): Promise<void> {
    await this.topicTransferRepository.save({ idTopic, idSubCategoryFrom, idSubCategoryTo });
  }
}
