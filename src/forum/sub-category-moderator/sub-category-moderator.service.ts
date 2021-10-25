import { Injectable } from '@nestjs/common';
import { SubCategoryModeratorRepository } from './sub-category-moderator.repository';
import { SubCategoryModeratorAddAndDeleteDto } from './sub-category-moderator.dto';
import { SubCategoryModerator } from './sub-category-moderator.entity';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class SubCategoryModeratorService {
  constructor(private subCategoryModeratorRepository: SubCategoryModeratorRepository) {}

  @Transactional()
  async addAndDelete(idSubCategory: number, dto: SubCategoryModeratorAddAndDeleteDto): Promise<SubCategoryModerator[]> {
    const promises: Promise<any>[] = [];
    if (dto.add.length) {
      promises.push(
        this.subCategoryModeratorRepository.save(dto.add.map(idModerator => ({ idModerator, idSubCategory })))
      );
    }
    if (dto.delete.length) {
      promises.push(this.subCategoryModeratorRepository.delete(dto.delete));
    }
    await Promise.all(promises);
    return this.findBySubCategory(idSubCategory);
  }

  async findBySubCategory(idSubCategory: number): Promise<SubCategoryModerator[]> {
    return this.subCategoryModeratorRepository.find({
      where: { idSubCategory },
      relations: ['moderator', 'moderator.player'],
    });
  }

  async isModerator(idSubCategory: number, idPlayer: number): Promise<boolean> {
    return this.subCategoryModeratorRepository.isModerator(idSubCategory, idPlayer);
  }
}
