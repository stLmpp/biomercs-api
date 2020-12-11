import { Injectable } from '@nestjs/common';
import { GameRepository } from './game.repository';
import { Game } from './game.entity';
import { GameAddDto, GameUpdateDto } from './game.dto';

@Injectable()
export class GameService {
  constructor(private gameRepository: GameRepository) {}

  async findById(idGame: number): Promise<Game> {
    return this.gameRepository.findOneOrFail(idGame);
  }

  async findAll(): Promise<Game[]> {
    return this.gameRepository.find();
  }

  async add(dto: GameAddDto): Promise<Game> {
    return this.gameRepository.save(new Game().extendDto(dto));
  }

  async update(idGame: number, dto: GameUpdateDto): Promise<Game> {
    await this.gameRepository.update(idGame, dto);
    return this.gameRepository.findOneOrFail(idGame);
  }
}
