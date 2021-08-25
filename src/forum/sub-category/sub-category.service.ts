import { Injectable } from '@nestjs/common';
import { SubCategoryRepository } from './sub-category.repository';
import { SubCategoryInfoViewModel } from './sub-category.view-model';
import { PostService } from '../post/post.service';
import { isBefore } from 'date-fns';
import { TopicService } from '../topic/topic.service';
import { SubCategoryModeratorService } from '../sub-category-moderator/sub-category-moderator.service';
import { SubCategory } from './sub-category.entity';
import { SubCategoryAddDto, SubCategoryUpdateDto } from './sub-category.dto';
import { SubCategoryTransferService } from '../sub-category-transfer/sub-category-transfer.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class SubCategoryService {
  constructor(
    private subCategoryRepository: SubCategoryRepository,
    private postService: PostService,
    private topicService: TopicService,
    private subCategoryModeratorService: SubCategoryModeratorService,
    private subCategoryTransferService: SubCategoryTransferService
  ) {}

  @Transactional()
  async update(idSubCategory: number, { deleted, restored, ...dto }: SubCategoryUpdateDto): Promise<SubCategory> {
    const subCategory = await this.subCategoryRepository.findOneOrFail(idSubCategory);
    const promises: Promise<any>[] = [this.subCategoryRepository.update(idSubCategory, dto)];
    if (dto.idCategory) {
      if (subCategory.idCategory !== dto.idCategory) {
        promises.push(
          this.subCategoryTransferService.add({
            idSubCategory,
            idCategoryFrom: subCategory.idCategory,
            idCategoryTo: dto.idCategory,
          })
        );
      }
    }
    if (deleted) {
      promises.push(this.subCategoryRepository.softDelete(idSubCategory));
    }
    if (restored) {
      promises.push(this.subCategoryRepository.restore(idSubCategory));
    }
    await Promise.all(promises);
    return this.subCategoryRepository.findOneOrFail(idSubCategory);
  }

  async add(dto: SubCategoryAddDto): Promise<SubCategory> {
    const lastOrder = await this.subCategoryRepository
      .findOne({ order: { order: 'DESC' }, select: ['order'] })
      .then(subCategory => subCategory?.order ?? 0);
    return this.subCategoryRepository.save({ ...dto, order: lastOrder + 1 });
  }

  async updateOrder(idSubCategories: number[]): Promise<SubCategory[]> {
    const dtos: Partial<SubCategory>[] = idSubCategories.map((id, index) => ({ id, order: index + 1 }));
    await this.subCategoryRepository.save(dtos);
    return this.subCategoryRepository.findByIds(idSubCategories);
  }

  async findById(idSubCategory: number): Promise<SubCategory> {
    return this.subCategoryRepository.findOneOrFail(idSubCategory);
  }

  async findSubCategoryInfo(idSubCategory: number, idPlayer: number): Promise<SubCategoryInfoViewModel> {
    const subCategoryInfo = new SubCategoryInfoViewModel();
    const [lastPost, postCount, topicCount, isModerator] = await Promise.all([
      this.postService.findLastPostSubCategory(idSubCategory, idPlayer),
      this.postService.countSubCategory(idSubCategory),
      this.topicService.countSubCategory(idSubCategory),
      this.subCategoryModeratorService.isModeratorByPlayerSubCategory(idSubCategory, idPlayer),
    ]);
    subCategoryInfo.id = idSubCategory;
    subCategoryInfo.postCount = postCount;
    subCategoryInfo.topicCount = topicCount;
    subCategoryInfo.isModerator = isModerator;
    if (lastPost) {
      subCategoryInfo.lastPostDate = lastPost.creationDate;
      subCategoryInfo.idPlayerLastPost = lastPost.idPlayer;
      subCategoryInfo.playerPersonaNameLastPost = lastPost.player?.personaName;
      subCategoryInfo.idTopicLastPost = lastPost.idTopic;
      subCategoryInfo.topicNameLastPost = lastPost.topic?.name;
      const topicPlayerLastRead = lastPost.topic?.topicPlayerLastReads?.[0];
      subCategoryInfo.hasNewPosts =
        !!topicPlayerLastRead && isBefore(topicPlayerLastRead.readDate, lastPost.creationDate);
    }
    return subCategoryInfo;
  }
}
