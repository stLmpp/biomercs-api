import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SubCategoryRepository } from './sub-category.repository';
import { SubCategoryWithInfoModeratorsTopicsViewModel, SubCategoryWithInfoViewModel } from './sub-category.view-model';
import { SubCategory } from './sub-category.entity';
import { SubCategoryAddDto, SubCategoryOrderDto, SubCategoryUpdateDto } from './sub-category.dto';
import { SubCategoryTransferService } from '../sub-category-transfer/sub-category-transfer.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { SubCategoryTransferAddDto } from '../sub-category-transfer/sub-category-transfer.dto';
import { ModeratorService } from '../moderator/moderator.service';
import { InjectMapProfile } from '../../mapper/inject-map-profile';
import { Moderator } from '../moderator/moderator.entity';
import { ModeratorViewModel } from '../moderator/moderator.view-model';
import { MapProfile } from '../../mapper/map-profile';
import { UserService } from '../../user/user.service';
import { TopicService } from '../topic/topic.service';

@Injectable()
export class SubCategoryService {
  constructor(
    private subCategoryRepository: SubCategoryRepository,
    private subCategoryTransferService: SubCategoryTransferService,
    private moderatorService: ModeratorService,
    @InjectMapProfile(Moderator, ModeratorViewModel)
    private mapProfileModerator: MapProfile<Moderator, ModeratorViewModel>,
    private userService: UserService,
    @Inject(forwardRef(() => TopicService)) private topicService: TopicService
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
    return this.subCategoryRepository.findOneOrFail(idSubCategory, { withDeleted: true });
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

  async findAllWithInfo(idPlayer: number, withDeleted?: boolean): Promise<SubCategoryWithInfoViewModel[]> {
    return this.subCategoryRepository.findAllWithInfo(idPlayer, withDeleted);
  }

  async findByIdWithTopicsPaginated(
    idSubCategory: number,
    idPlayer: number,
    page: number,
    limit: number
  ): Promise<SubCategoryWithInfoModeratorsTopicsViewModel> {
    const isAdmin = await this.userService.isAdminByPlayer(idPlayer);
    const [subCategoryWithInfo, topics, moderators] = await Promise.all([
      this.subCategoryRepository.findByIdWithInfo(idSubCategory, idPlayer, isAdmin),
      this.topicService.findBySubCategoryPaginated(idSubCategory, idPlayer, page, limit),
      this.moderatorService.findBySubCategory(idSubCategory),
    ]);
    for (const topic of topics.items) {
      topic.isModerator = topic.isModerator || isAdmin;
    }
    const moderatorsViewModel = this.mapProfileModerator.map(moderators);
    return new SubCategoryWithInfoModeratorsTopicsViewModel({
      ...subCategoryWithInfo,
      topics,
      moderators: moderatorsViewModel,
    });
  }

  async findIdCategoryByIdSubCategory(idSubCategory: number): Promise<number> {
    return this.subCategoryRepository
      .findOneOrFail(idSubCategory, { select: ['idCategory'] })
      .then(subCategory => subCategory.idCategory);
  }
}
