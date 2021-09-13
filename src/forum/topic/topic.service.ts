import { Injectable } from '@nestjs/common';
import { TopicRepository } from './topic.repository';
import { TopicViewModel } from './topic.view-model';

@Injectable()
export class TopicService {
  constructor(private topicRepository: TopicRepository) {}

  async findBySubCategory(idSubCategory: number, idPlayer: number): Promise<TopicViewModel[]> {
    return this.topicRepository.findBySubCategory(idSubCategory, idPlayer);
  }
}
