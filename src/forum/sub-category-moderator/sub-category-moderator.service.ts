import { Injectable } from '@nestjs/common';
import { SubCategoryModeratorRepository } from './sub-category-moderator.repository';
import { Moderator } from '../moderator/moderator.entity';
import { SubCategoryModeratorAddAndDeleteDto } from './sub-category-moderator.dto';
import { ModeratorService } from '../moderator/moderator.service';

@Injectable()
export class SubCategoryModeratorService {
  constructor(
    private subCategoryModeratorRepository: SubCategoryModeratorRepository,
    private moderatorService: ModeratorService
  ) {}

  async isModeratorByPlayerSubCategory(idSubCategory: number, idPlayer: number): Promise<boolean> {
    return this.subCategoryModeratorRepository.exists(
      { idSubCategory, moderator: { idPlayer } },
      { relations: ['moderator'] }
    );
  }

  async addAndDelete(idSubCategory: number, dto: SubCategoryModeratorAddAndDeleteDto): Promise<Moderator[]> {
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
    return this.moderatorService.findBySubCategory(idSubCategory);
  }
}
