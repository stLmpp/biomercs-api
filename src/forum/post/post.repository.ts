import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { PostEntity } from './post.entity';
import { PostViewModel, PostViewModelPagination } from './post.view-model';
import { NotFoundException } from '@nestjs/common';
import { SubCategoryModerator } from '../sub-category-moderator/sub-category-moderator.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { plainToClass } from 'class-transformer';
import { PaginationMeta } from '../../shared/view-model/pagination.view-model';

type PostRaw = PostViewModel & { isModerator: number | null };

function mapFromPostRawToViewModel(postRaw: PostRaw): PostViewModel {
  return plainToClass(PostViewModel, {
    ...postRaw,
    editAllowed: postRaw.editAllowed || !!postRaw.isModerator,
    deleteAllowed: postRaw.deleteAllowed || !!postRaw.isModerator,
  });
}

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
  private _createQueryBuilderViewModel(idTopic: number, idPlayer: number): SelectQueryBuilder<PostEntity> {
    return this.createQueryBuilder('post')
      .select('post.id', 'id')
      .addSelect('post.name', 'name')
      .addSelect('post.content', 'content')
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
            .andWhere('post_count.idPlayer = post.idPlayer'),
        'postCount'
      )
      .addSelect('region.id', 'idRegion')
      .addSelect('region.name', 'nameRegion')
      .addSelect('region.shortName', 'shortNameRegion')
      .addSelect(`player.id = ${idPlayer}`, 'editAllowed')
      .addSelect(
        subQuery =>
          subQuery
            .subQuery()
            .select(`(player.id = ${idPlayer} AND post_first.id != post.id)`)
            .from(PostEntity, 'post_first')
            .andWhere('post_first.idTopic = :idTopic', { idTopic })
            .orderBy('post_first.id', 'ASC')
            .limit(1),
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
}
