import { ForbiddenException, Injectable } from '@nestjs/common';
import { TopicRepository } from './topic.repository';
import {
  TopicAddViewModel,
  TopicPostPageViewModel,
  TopicViewModelPaginated,
  TopicWithPostsViewModel,
} from './topic.view-model';
import { Topic } from './topic.entity';
import { Cron } from '@nestjs/schedule';
import { UpdateResult } from 'typeorm';
import { PostService } from '../post/post.service';
import { SubCategoryModeratorService } from '../sub-category-moderator/sub-category-moderator.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { TopicAddDto } from './topic.dto';

@Injectable()
export class TopicService {
  constructor(
    private topicRepository: TopicRepository,
    private postService: PostService,
    private subCategoryModeratorService: SubCategoryModeratorService
  ) {}

  private readonly _increaseViewsMap = new Map<number, number>();

  @Transactional()
  async add(idSubCategory: number, { name, content }: TopicAddDto, idPlayer: number): Promise<TopicAddViewModel> {
    const topic = await this.topicRepository.save({ name, idPlayer, idSubCategory, views: 0 });

    await this.postService.add({ name, content, idTopic: topic.id }, idPlayer);
    return {
      idTopic: topic.id,
      page: await this.findPageById(idSubCategory, topic.id, idPlayer),
    };
  }

  @Cron('*/30 * * * * *')
  async increaseViewsCron(): Promise<void> {
    if (!this._increaseViewsMap.size) {
      return;
    }
    const promises: Promise<UpdateResult>[] = [];
    for (const [idTopic, views] of this._increaseViewsMap) {
      promises.push(this.topicRepository.increaseView(idTopic, views));
    }
    this._increaseViewsMap.clear();
    await Promise.all(promises);
  }

  async findPageById(idSubCategory: number, idTopic: number, idPlayer: number): Promise<number> {
    return this.topicRepository.findPageById(idSubCategory, idTopic, idPlayer);
  }

  async findBySubCategoryPaginated(
    idSubCategory: number,
    idPlayer: number,
    page: number,
    limit: number
  ): Promise<TopicViewModelPaginated> {
    return this.topicRepository.findBySubCategoryPaginated(idSubCategory, idPlayer, page, limit);
  }

  async findRecentTopics(limit: number): Promise<Topic[]> {
    return this.topicRepository.findRecentTopics(limit);
  }

  increaseView(idTopic: number): void {
    const views = this._increaseViewsMap.get(idTopic) ?? 0;
    this._increaseViewsMap.set(idTopic, views + 1);
  }

  async findByIdWithPostsPaginated(
    idTopic: number,
    idPlayer: number,
    page: number,
    limit: number
  ): Promise<TopicWithPostsViewModel> {
    const [topic, posts] = await Promise.all([
      this.topicRepository.findById(idTopic, idPlayer),
      this.postService.findByTopicPaginated(idTopic, idPlayer, page, limit),
    ]);
    const topicWithPostsViewModel = new TopicWithPostsViewModel();
    Object.assign(topicWithPostsViewModel, topic);
    topicWithPostsViewModel.posts = posts;
    return topicWithPostsViewModel;
  }

  async delete(idSubCategory: number, idTopic: number, idPlayer: number): Promise<void> {
    const isModerator = await this.subCategoryModeratorService.isModerator(idSubCategory, idPlayer);
    if (!isModerator) {
      const isCreator = await this.topicRepository.exists({ id: idTopic, idPlayer });
      if (!isCreator) {
        throw new ForbiddenException(`You can only delete topics you own`);
      }
    }
    await this.topicRepository.softDelete(idTopic);
  }

  async lock(idTopic: number): Promise<void> {
    await this.topicRepository.update(idTopic, { lockedDate: new Date() });
  }

  async unlock(idTopic: number): Promise<void> {
    await this.topicRepository.update(idTopic, { lockedDate: null });
  }

  async pin(idTopic: number): Promise<void> {
    await this.topicRepository.update(idTopic, { pinned: true });
  }

  async unpin(idTopic: number): Promise<void> {
    await this.topicRepository.update(idTopic, { pinned: false });
  }

  async findPageTopicPost(
    idSubCategory: number,
    idTopic: number,
    idPost: number,
    idPlayer: number
  ): Promise<TopicPostPageViewModel> {
    const [pageTopic, pagePost] = await Promise.all([
      this.findPageById(idSubCategory, idTopic, idPlayer),
      this.postService.findPageById(idTopic, idPost, idPlayer),
    ]);
    return { idSubCategory, idTopic, idPost, pageTopic, pagePost };
  }
}
