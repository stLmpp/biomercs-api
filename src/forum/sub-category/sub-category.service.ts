import { Injectable } from '@nestjs/common';
import { SubCategoryRepository } from './sub-category.repository';
import { SubCategory } from './sub-category.entity';
import { SubCategoryUpsertWithCategoryDto } from './sub-category.dto';
import { filterDeleted } from '../../util/filter-deleted';
import { filterRestored } from '../../util/filter-restored';
import { filterId } from '../../util/filter-id';
import { SubCategoryTransferService } from '../sub-category-transfer/sub-category-transfer.service';
import { SubCategoryTransferAddDto } from '../sub-category-transfer/sub-category-transfer.dto';
import { SubCategoryInfoViewModel } from './sub-category.view-model';
import { PostService } from '../post/post.service';
import { isBefore } from 'date-fns';
import { TopicService } from '../topic/topic.service';
import { SubCategoryModeratorService } from '../sub-category-moderator/sub-category-moderator.service';

@Injectable()
export class SubCategoryService {
  constructor(
    private subCategoryRepository: SubCategoryRepository,
    private subCategoryTransferService: SubCategoryTransferService,
    private postService: PostService,
    private topicService: TopicService,
    private subCategoryModeratorService: SubCategoryModeratorService
  ) {}

  async upsert(dtos: SubCategoryUpsertWithCategoryDto[]): Promise<SubCategory[]> {
    // Check for deleted sub categories
    const deleted = filterDeleted(dtos);
    if (deleted.length) {
      await this.subCategoryRepository.softDelete(deleted.map(dto => dto.id));
    }
    // Check for restored sub categories
    const restored = filterRestored(dtos);
    if (restored.length) {
      await this.subCategoryRepository.restore(restored.map(dto => dto.id));
    }

    // Check for new sub categories (without the id)
    const dtoAdded = dtos.filter(dto => !dto.id);
    const newSubCategories = await this.subCategoryRepository.save(dtoAdded);
    const idSubCategories = newSubCategories.map(subCategory => subCategory.id);
    // Check for updated sub categories (has the id defined)
    const dtoUpdated = filterId(dtos);
    // Find the sub categories that are in the database
    const subCategories = await this.subCategoryRepository.findByIds(dtoUpdated.map(dto => dto.id));

    const subCategoryTransferDtos: SubCategoryTransferAddDto[] = [];
    for (const dto of dtoUpdated) {
      // Try to find the sub category in the array of sub categories fetched from the database
      const subCategory = subCategories.find(_subCategory => _subCategory.id === dto.id);
      // If not found, then do nothing
      if (!subCategory) {
        continue;
      }
      // If the idCategory changed, we need to register this in the SubCategoryTransfer table
      if (dto.idCategory !== subCategory.idCategory) {
        subCategoryTransferDtos.push(new SubCategoryTransferAddDto(dto.id, subCategory.idCategory, dto.idCategory));
      }
      idSubCategories.push(dto.id);
    }
    if (subCategoryTransferDtos.length) {
      await this.subCategoryTransferService.addMany(subCategoryTransferDtos);
    }
    await this.subCategoryRepository.save(dtoUpdated);
    return this.subCategoryRepository.findByIds(idSubCategories);
  }

  async findSubCategoryInfo(idSubCategory: number, idPlayer: number): Promise<SubCategoryInfoViewModel> {
    const subCategoryInfo = new SubCategoryInfoViewModel();
    const [lastPost, postCount, topicCount, isModerator] = await Promise.all([
      this.postService.findLastPostSubCategory(idSubCategory, idPlayer),
      this.postService.countSubCategory(idSubCategory),
      this.topicService.countSubCategory(idSubCategory),
      this.subCategoryModeratorService.isModeratorByPlayerSubCategory(idSubCategory, idPlayer),
    ]);
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
