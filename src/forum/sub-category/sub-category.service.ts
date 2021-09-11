import { Injectable } from '@nestjs/common';
import { SubCategoryRepository } from './sub-category.repository';
import { SubCategoryInfoViewModel } from './sub-category.view-model';
import { PostService } from '../post/post.service';
import { isBefore } from 'date-fns';
import { TopicService } from '../topic/topic.service';
import { SubCategoryModeratorService } from '../sub-category-moderator/sub-category-moderator.service';
import { SubCategory } from './sub-category.entity';
import { SubCategoryAddDto, SubCategoryOrderDto, SubCategoryUpdateDto } from './sub-category.dto';
import { SubCategoryTransferService } from '../sub-category-transfer/sub-category-transfer.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { SubCategoryTransferAddDto } from '../sub-category-transfer/sub-category-transfer.dto';

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

  @Transactional()
  async updateOrder(dtos: SubCategoryOrderDto[]): Promise<SubCategory[]> {
    const subCategories = await this.subCategoryRepository.findByIds(
      dtos.filter(dto => dto.idCategory).map(dto => dto.id)
    );
    const subCategoryTransferAddDtos: SubCategoryTransferAddDto[] = [];
    for (const subCategory of subCategories) {
      const dto = dtos.find(_dto => _dto.id === subCategory.id);
      if (!dto || dto.idCategory === subCategory.idCategory) {
        continue;
      }
      subCategoryTransferAddDtos.push({
        idSubCategory: subCategory.id,
        idCategoryFrom: subCategory.idCategory,
        idCategoryTo: dto.idCategory!,
      });
    }
    const promises: Promise<any>[] = [this.subCategoryRepository.save(dtos)];
    if (subCategoryTransferAddDtos.length) {
      promises.push(this.subCategoryTransferService.addMany(subCategoryTransferAddDtos));
    }
    await Promise.all(promises);
    return this.subCategoryRepository.findByIds(dtos.map(dto => dto.id));
  }

  async add(dto: SubCategoryAddDto): Promise<SubCategory> {
    const lastOrder = await this.subCategoryRepository
      .findOne({ order: { order: 'DESC' }, select: ['order'] })
      .then(subCategory => subCategory?.order ?? 0);
    return this.subCategoryRepository.save({ ...dto, order: lastOrder + 1 });
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
