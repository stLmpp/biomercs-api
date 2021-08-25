import { Injectable } from '@nestjs/common';
import { ModeratorRepository } from './moderator.repository';
import { Moderator } from './moderator.entity';
import { ModeratorAddAndDeleteDto } from './moderator.dto';

@Injectable()
export class ModeratorService {
  constructor(private moderatorRepository: ModeratorRepository) {}

  async addAndDelete(dto: ModeratorAddAndDeleteDto): Promise<Moderator[]> {
    const promises: Promise<any>[] = [];
    if (dto.add.length) {
      promises.push(this.moderatorRepository.save(dto.add.map(idPlayer => ({ idPlayer }))));
    }
    if (dto.delete.length) {
      promises.push(this.moderatorRepository.delete(dto.delete));
    }
    await Promise.all(promises);
    return this.findAll();
  }

  async findAll(): Promise<Moderator[]> {
    return this.moderatorRepository.find({ relations: ['subCategoryModerators'], order: { id: 'ASC' } });
  }
}
