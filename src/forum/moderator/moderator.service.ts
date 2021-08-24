import { Injectable } from '@nestjs/common';
import { ModeratorRepository } from './moderator.repository';
import { Moderator } from './moderator.entity';

@Injectable()
export class ModeratorService {
  constructor(private moderatorRepository: ModeratorRepository) {}

  async add(idPlayer: number): Promise<Moderator> {
    return this.moderatorRepository.save({ idPlayer });
  }

  async remove(idPlayer: number): Promise<void> {
    await this.moderatorRepository.delete(idPlayer);
  }

  async addMany(idPlayers: number[]): Promise<Moderator[]> {
    return this.moderatorRepository.save(idPlayers.map(idPlayer => ({ idPlayer })));
  }

  async removeMany(idPlayers: number[]): Promise<void> {
    await this.moderatorRepository.delete(idPlayers);
  }
}
