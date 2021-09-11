import { Injectable } from '@nestjs/common';
import { ModeratorRepository } from './moderator.repository';
import { Moderator } from './moderator.entity';
import { ModeratorAddAndDeleteDto } from './moderator.dto';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class ModeratorService {
  constructor(private moderatorRepository: ModeratorRepository) {}

  @Transactional()
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
    return this.moderatorRepository.findAll();
  }

  async search(term: string, idModeratorsSelected: number[]): Promise<Moderator[]> {
    return this.moderatorRepository.search(term, idModeratorsSelected);
  }
}
