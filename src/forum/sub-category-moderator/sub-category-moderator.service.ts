import { Injectable } from '@nestjs/common';
import { SubCategoryModeratorRepository } from './sub-category-moderator.repository';

@Injectable()
export class SubCategoryModeratorService {
  constructor(private subCategoryModeratorRepository: SubCategoryModeratorRepository) {}

  async isModeratorByPlayerSubCategory(idSubCategory: number, idPlayer: number): Promise<boolean> {
    return this.subCategoryModeratorRepository.exists(
      { idSubCategory, moderator: { idPlayer } },
      { relations: ['moderator'] }
    );
  }
}
