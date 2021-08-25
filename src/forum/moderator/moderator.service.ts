import { Injectable } from '@nestjs/common';
import { ModeratorRepository } from './moderator.repository';
import { Moderator } from './moderator.entity';

@Injectable()
export class ModeratorService {
  constructor(private moderatorRepository: ModeratorRepository) {}

  async add(idPlayer: number): Promise<Moderator> {
    return this.moderatorRepository.save({ idPlayer });
  }

  async delete(idPlayer: number): Promise<void> {
    await this.moderatorRepository.delete(idPlayer);
  }

  async addMany(idPlayers: number[]): Promise<Moderator[]> {
    return this.moderatorRepository.save(idPlayers.map(idPlayer => ({ idPlayer })));
  }

  async deleteMany(idPlayers: number[]): Promise<void> {
    await this.moderatorRepository.delete(idPlayers);
  }

  async findAll(): Promise<Moderator[]> {
    return this.moderatorRepository.find({ relations: ['subCategoryModerators'], order: { id: 'ASC' } });
  }
}
