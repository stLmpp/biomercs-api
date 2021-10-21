import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { PostEntity } from './post.entity';
import { PostViewModel, PostViewModelPagination } from './post.view-model';
import { NotFoundException } from '@nestjs/common';
import { SubCategoryModerator } from '../sub-category-moderator/sub-category-moderator.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { plainToClass } from 'class-transformer';
import { PaginationMeta } from '../../shared/view-model/pagination.view-model';
import { FORUM_DEFAULT_LIMIT } from '../forum';

type PostRaw = Omit<PostViewModel, 'postCount'> & { isModerator: number | null; firstPost: boolean; postCount: string };

function mapFromPostRawToViewModel(postRaw: PostRaw): PostViewModel {
  return plainToClass(PostViewModel, {
    ...postRaw,
    editAllowed: !postRaw.deletedDate && (postRaw.editAllowed || !!postRaw.isModerator),
    deleteAllowed: !postRaw.deletedDate && (postRaw.deleteAllowed || !!postRaw.isModerator),
    postCount: +postRaw.postCount,
  });
}

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
  private _createQueryBuilderViewModel(idTopic: number, idPlayer: number): SelectQueryBuilder<PostEntity> {
    const firstPostQueryBuilder = (queryBuilder: SelectQueryBuilder<any>, alias: string): SelectQueryBuilder<any> =>
      queryBuilder
        .subQuery()
        .from(PostEntity, alias)
        .withDeleted()
        .andWhere(`${alias}.idTopic = :idTopic`, { idTopic })
        .orderBy(`${alias}.id`, 'ASC')
        .limit(1);

    return this.createQueryBuilder('post')
      .withDeleted()
      .select('post.id', 'id')
      .addSelect('post.name', 'name')
      .addSelect(`case when "post"."deletedDate" is null then "post"."content" else '[ post deleted ]' end`, 'content')
      .addSelect('post.idTopic', 'idTopic')
      .addSelect('player.id', 'idPlayer')
      .addSelect('post.deletedDate', 'deletedDate')
      .addSelect('player.personaName', 'personaNamePlayer')
      .addSelect(
        subQuery =>
          subQuery
            .subQuery()
            .select('count(1)')
            .from(PostEntity, 'post_count')
            .withDeleted()
            .andWhere('post_count.idPlayer = post.idPlayer'),
        'postCount'
      )
      .addSelect('region.id', 'idRegion')
      .addSelect('region.name', 'nameRegion')
      .addSelect('region.shortName', 'shortNameRegion')
      .addSelect(`player.id = ${idPlayer}`, 'editAllowed')
      .addSelect(
        subQuery =>
          firstPostQueryBuilder(subQuery, 'post_first').select(
            `(player.id = ${idPlayer} AND post_first.id != post.id)`
          ),
        'deleteAllowed'
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
      .addSelect(
        subQuery => firstPostQueryBuilder(subQuery, 'post_first_1').select('post_first_1.id = post.id'),
        'firstPost'
      )
      .innerJoin('post.topic', 'topic')
      .innerJoin('post.player', 'player')
      .innerJoin('player.region', 'region')
      .andWhere('post.idTopic = :idTopic', { idTopic });
  }

  async findByTopicPaginated(
    idTopic: number,
    idPlayer: number,
    page: number,
    limit: number
  ): Promise<PostViewModelPagination> {
    const queryBuilder = this._createQueryBuilderViewModel(idTopic, idPlayer).orderBy('post.id', 'ASC');
    const raw: Pagination<PostRaw, PaginationMeta> = await queryBuilder.paginateRaw(page, limit);
    return new PostViewModelPagination(raw.items.map(mapFromPostRawToViewModel), raw.meta);
  }

  async findById(idTopic: number, idPost: number, idPlayer: number): Promise<PostViewModel> {
    const raw = await this._createQueryBuilderViewModel(idTopic, idPlayer)
      .andWhere('post.id = :idPost', { idPost })
      .getRawOne<PostRaw>();
    if (!raw) {
      throw new NotFoundException(`Post with id "${idPost}" not found`);
    }
    return mapFromPostRawToViewModel(raw);
  }

  async findPageById(idTopic: number, idPost: number, idPlayer: number): Promise<number> {
    return this._createQueryBuilderViewModel(idTopic, idPlayer)
      .orderBy('post.id', 'ASC')
      .getPage('post', idPost, FORUM_DEFAULT_LIMIT);
  }
}
