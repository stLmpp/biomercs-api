import { EntityRepository, Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { Topic } from './topic.entity';
import { TopicViewModel, TopicViewModelPaginated } from './topic.view-model';
import { PostEntity } from '../post/post.entity';
import { TopicPlayerLastRead } from '../topic-player-last-read/topic-player-last-read.entity';
import { plainToClass } from 'class-transformer';
import { NotFoundException } from '@nestjs/common';
import { SubCategoryModerator } from '../sub-category-moderator/sub-category-moderator.entity';
import { FORUM_DEFAULT_LIMIT } from '../forum';

type TopicRaw = Omit<TopicViewModel, 'repliesCount' | 'hasNewPosts' | 'isModerator'> & {
  repliesCount: string;
  hasNewPosts: boolean | null;
  isModerator: number | null;
};

function mapFromTopicRawToTopicViewModel(topicRaw: TopicRaw): TopicViewModel {
  return plainToClass(TopicViewModel, {
    ...topicRaw,
    repliesCount: +topicRaw.repliesCount,
    hasNewPosts: !!topicRaw.hasNewPosts,
    isModerator: !!topicRaw.isModerator,
  });
}

@EntityRepository(Topic)
export class TopicRepository extends Repository<Topic> {
  private _createQueryBuilderWithInfo(idPlayer: number): SelectQueryBuilder<Topic> {
    return this.createQueryBuilder('topic')
      .select('topic.id', 'id')
      .addSelect('topic.name', 'name')
      .addSelect('topic.idSubCategory', 'idSubCategory')
      .addSelect('topic.idScore', 'idScore')
      .addSelect('topic.idPlayer', 'idPlayer')
      .addSelect('player.personaName', 'playerPersonaName')
      .addSelect('topic.views', 'views')
      .addSelect('topic.pinned', 'pinned')
      .addSelect('topic.lockedDate', 'lockedDate')
      .addSelect('player_last_post.id', 'idPlayerLastPost')
      .addSelect('player_last_post.personaName', 'playerPersonaNameLastPost')
      .addSelect('last_post.creationDate', 'lastPostDate')
      .addSelect('last_post.id', 'idLastPost')
      .addSelect('last_post.name', 'nameLastPost')
      .addSelect('topic.creationDate', 'creationDate')
      .addSelect(
        subQuery =>
          subQuery
            .subQuery()
            .select('count(1)')
            .from(PostEntity, 'post_count')
            .andWhere('post_count.idTopic = topic.id'),
        'repliesCount'
      )
      .addSelect(
        subQuery =>
          subQuery
            .subQuery()
            .select('last_read.readDate < last_post.creationDate')
            .from(TopicPlayerLastRead, 'last_read')
            .andWhere('last_read.idTopic = topic.id')
            .andWhere('last_read.idPlayer = :idPlayer', { idPlayer }),
        'hasNewPosts'
      )
      .addSelect(
        subQuery =>
          subQuery
            .subQuery()
            .select('sub_category_moderator.id')
            .from(SubCategoryModerator, 'sub_category_moderator')
            .innerJoin('sub_category_moderator.moderator', 'moderator')
            .andWhere('sub_category_moderator.idSubCategory = topic.idSubCategory')
            .andWhere('moderator.idPlayer = :idPlayer', { idPlayer }),
        'isModerator'
      )
      .innerJoin('topic.posts', 'last_post')
      .innerJoin('last_post.player', 'player_last_post')
      .innerJoin('topic.player', 'player')
      .andWhere(
        subQuery =>
          `last_post.id = (${subQuery
            .subQuery()
            .addSelect('post_join.id')
            .from(PostEntity, 'post_join')
            .andWhere('post_join.idTopic = topic.id')
            .orderBy('post_join.id', 'DESC')
            .limit(1)
            .getQuery()})`
      );
  }

  private _addOrderByPaginated(queryBuilder: SelectQueryBuilder<Topic>): SelectQueryBuilder<Topic> {
    return queryBuilder
      .addOrderBy('topic.pinned', 'DESC')
      .addOrderBy('last_post.creationDate', 'DESC')
      .addOrderBy('topic.id', 'ASC');
  }

  async findBySubCategoryPaginated(
    idSubCategory: number,
    idPlayer: number,
    page: number,
    limit: number
  ): Promise<TopicViewModelPaginated> {
    const queryBuilder = this._addOrderByPaginated(this._createQueryBuilderWithInfo(idPlayer)).andWhere(
      'topic.idSubCategory = :idSubCategory',
      {
        idSubCategory,
      }
    );
    const paginated = await queryBuilder.paginateRaw<TopicRaw>(page, limit);
    return new TopicViewModelPaginated(paginated.items.map(mapFromTopicRawToTopicViewModel), paginated.meta);
  }

  async findRecentTopics(limit: number): Promise<Topic[]> {
    return this.createQueryBuilder('topic')
      .innerJoinAndSelect('topic.posts', 'last_post')
      .innerJoinAndSelect('topic.subCategory', 'sub_category')
      .innerJoinAndSelect('last_post.player', 'player_last_post')
      .andWhere(
        subQuery =>
          `last_post.id = (${subQuery
            .subQuery()
            .addSelect('post_join.id')
            .from(PostEntity, 'post_join')
            .andWhere('post_join.idTopic = topic.id')
            .orderBy('post_join.id', 'DESC')
            .limit(1)
            .getQuery()})`
      )
      .limit(limit)
      .addOrderBy('last_post.creationDate', 'DESC')
      .getMany();
  }

  async findById(idTopic: number, idPlayer: number): Promise<TopicViewModel> {
    const queryBuilder = this._createQueryBuilderWithInfo(idPlayer).andWhere('topic.id = :idTopic', { idTopic });
    const raw: TopicRaw | undefined = await queryBuilder.getRawOne();
    if (!raw) {
      throw new NotFoundException(`Topic with id "${idTopic}" not found`);
    }
    return mapFromTopicRawToTopicViewModel(raw);
  }

  async increaseView(idTopic: number, views: number): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update()
      .set({ views: () => `views + ${views}` })
      .where({ id: idTopic })
      .execute();
  }

  async findLastPageBySubCategory(idSubCategory: number, idTopic: number, idPlayer: number): Promise<number> {
    return await this._addOrderByPaginated(this._createQueryBuilderWithInfo(idPlayer))
      .andWhere('topic.idSubCategory = :idSubCategory', {
        idSubCategory,
      })
      .getPage('topic', idTopic, FORUM_DEFAULT_LIMIT);
  }
}
