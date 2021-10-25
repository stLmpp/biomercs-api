import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { SubCategory } from './sub-category.entity';
import { Topic } from '../topic/topic.entity';
import { PostEntity } from '../post/post.entity';
import { SubCategoryModerator } from '../sub-category-moderator/sub-category-moderator.entity';
import { TopicPlayerLastRead } from '../topic-player-last-read/topic-player-last-read.entity';
import { plainToClass } from 'class-transformer';
import { SubCategoryWithInfoViewModel } from './sub-category.view-model';
import { NotFoundException } from '@nestjs/common';

type SubCategoryWithInfoRaw = Omit<
  SubCategoryWithInfoViewModel,
  'isModerator' | 'topicCount' | 'postCount' | 'hasNewPosts'
> & {
  isModerator: number | null;
  topicCount: string;
  postCount: string;
  hasNewPosts: boolean | null;
};

function mapFromSubCategoryWithInfoRawToSubCategoryWithInfoViewModel(
  subCategoryRaw: SubCategoryWithInfoRaw
): SubCategoryWithInfoViewModel {
  return plainToClass(SubCategoryWithInfoViewModel, {
    ...subCategoryRaw,
    hasNewPosts: subCategoryRaw.hasNewPosts ?? !!+subCategoryRaw.postCount,
    isModerator: !!subCategoryRaw.isModerator,
    postCount: +subCategoryRaw.postCount,
    topicCount: +subCategoryRaw.topicCount,
  });
}

@EntityRepository(SubCategory)
export class SubCategoryRepository extends Repository<SubCategory> {
  private _createQueryBuilderWithInfo(idPlayer: number, withDeleted = false): SelectQueryBuilder<SubCategory> {
    const queryBuilder = this.createQueryBuilder('sub_category')
      .select('sub_category.id', 'id')
      .addSelect('sub_category.name', 'name')
      .addSelect('sub_category.description', 'description')
      .addSelect('sub_category.idCategory', 'idCategory')
      .addSelect('sub_category.order', 'order')
      .addSelect('player_last_post.personaName', 'playerPersonaNameLastPost')
      .addSelect('player_last_post.id', 'idPlayerLastPost')
      .addSelect('last_topic.id', 'idTopicLastPost')
      .addSelect('last_topic.name', 'topicNameLastPost')
      .addSelect('last_post.creationDate', 'lastPostDate')
      .addSelect('last_post.id', 'idLastPost')
      .addSelect('last_post.name', 'nameLastPost')
      .addSelect(
        subQuery =>
          subQuery
            .subQuery()
            .select('count(1)')
            .from(Topic, 'topic_count')
            .andWhere('topic_count.idSubCategory = sub_category.id'),
        'topicCount'
      )
      .addSelect(
        subQuery =>
          subQuery
            .subQuery()
            .withDeleted()
            .select('count(1)')
            .from(PostEntity, 'post_count')
            .innerJoin('post_count.topic', 'topic_post_count', 'topic_post_count.idSubCategory = sub_category.id'),
        'postCount'
      )
      .addSelect(
        subQuery =>
          subQuery
            .addSelect('last_read.readDate < last_post.creationDate')
            .from(TopicPlayerLastRead, 'last_read')
            .andWhere('last_read.idTopic = last_topic.id')
            .andWhere('last_read.idPlayer = :idPlayer'),
        'hasNewPosts'
      )
      .addSelect(
        subQuery =>
          subQuery
            .subQuery()
            .select('sub_category_moderator.id')
            .from(SubCategoryModerator, 'sub_category_moderator')
            .innerJoin('sub_category_moderator.moderator', 'moderator')
            .andWhere('sub_category_moderator.idSubCategory = sub_category.id')
            .andWhere('moderator.idPlayer = :idPlayer', { idPlayer }),
        'isModerator'
      )
      .withDeleted()
      .leftJoin('sub_category.topics', 'last_topic')
      .leftJoin('last_topic.posts', 'last_post')
      .leftJoin('last_post.player', 'player_last_post')
      .andWhere(
        subQuery =>
          `(last_topic.id = (${subQuery
            .subQuery()
            .withDeleted()
            .select('topic_join.id')
            .from(Topic, 'topic_join')
            .innerJoin('topic_join.posts', 'topic_post_join')
            .andWhere('topic_join.idSubCategory = sub_category.id')
            .andWhere('topic_join.deletedDate is null')
            .orderBy('topic_post_join.creationDate', 'DESC')
            .limit(1)
            .getQuery()}) or last_topic.id is null)`
      )
      .andWhere(
        subQuery =>
          `(last_post.id = (${subQuery
            .subQuery()
            .withDeleted()
            .from(PostEntity, 'post_join')
            .addSelect('post_join.id')
            .andWhere('post_join.idTopic = last_topic.id')
            .orderBy('post_join.creationDate', 'DESC')
            .limit(1)
            .getQuery()}) or last_post.id is null)`
      )
      .addOrderBy('sub_category.order', 'ASC');
    if (!withDeleted) {
      queryBuilder.andWhere('sub_category.deletedDate is null');
    }
    return queryBuilder;
  }

  async findAllWithInfo(idPlayer: number, withDeleted?: boolean): Promise<SubCategoryWithInfoViewModel[]> {
    const queryBuilder = this._createQueryBuilderWithInfo(idPlayer, withDeleted);
    const subCategoriesRaw: SubCategoryWithInfoRaw[] = await queryBuilder.getRawMany();
    return subCategoriesRaw.map(mapFromSubCategoryWithInfoRawToSubCategoryWithInfoViewModel);
  }

  async findByIdWithInfo(
    idSubCategory: number,
    idPlayer: number,
    withDeleted?: boolean
  ): Promise<SubCategoryWithInfoViewModel> {
    const queryBuilder = this._createQueryBuilderWithInfo(idPlayer, withDeleted).andWhere(
      'sub_category.id = :idSubCategory',
      { idSubCategory }
    );
    const subCategoryRaw: SubCategoryWithInfoRaw | undefined = await queryBuilder.getRawOne();
    if (!subCategoryRaw) {
      throw new NotFoundException(`SubCategory with id "${idSubCategory}" not found`);
    }
    return mapFromSubCategoryWithInfoRawToSubCategoryWithInfoViewModel(subCategoryRaw);
  }
}
