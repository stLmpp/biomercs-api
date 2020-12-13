import { EntityRepository, Repository } from 'typeorm';
import { Character } from './character.entity';

@EntityRepository(Character)
export class CharacterRepository extends Repository<Character> {
  async findByIdPlatformGameMiniGameMode(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Promise<Character[]> {
    return this.createQueryBuilder('c')
      .innerJoinAndSelect('c.characterCostumes', 'cc')
      .innerJoin('cc.platformGameMiniGameModeCharacterCostumes', 'pgmmcc')
      .innerJoin('pgmmcc.platformGameMiniGameMode', 'pgmm')
      .innerJoin('pgmm.platformGameMiniGame', 'pgm')
      .innerJoin('pgm.gameMiniGame', 'gm')
      .andWhere('pgm.idPlatform = :idPlatform', { idPlatform })
      .andWhere('gm.idGame = :idGame', { idGame })
      .andWhere('gm.idMiniGame = :idMiniGame', { idMiniGame })
      .andWhere('pgmm.idMode = :idMode', { idMode })
      .getMany();
  }
}
