import { Injectable } from '@nestjs/common';
import { TopicRepository } from './topic.repository';

@Injectable()
export class TopicService {
  constructor(private topicRepository: TopicRepository) {}

  async countSubCategory(idSubCategory: number): Promise<number> {
    return this.topicRepository.count({ where: { idSubCategory } });
  }
}
