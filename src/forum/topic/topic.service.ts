import { Injectable } from '@nestjs/common';
import { TopicRepository } from './topic.repository';
import { TopicViewModelPaginated } from './topic.view-model';

@Injectable()
export class TopicService {
  constructor(private topicRepository: TopicRepository) {}

  async findBySubCategoryPaginated(
    idSubCategory: number,
    idPlayer: number,
    page: number,
    limit: number
  ): Promise<TopicViewModelPaginated> {
    return this.topicRepository.findBySubCategoryPaginated(idSubCategory, idPlayer, page, limit);
  }
}
