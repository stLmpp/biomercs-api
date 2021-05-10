import { EntityRepository, Repository } from 'typeorm';
import { Character } from './character.entity';
import { CharacterPlatformsGamesMiniGamesModesDto } from './character.dto';

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
      .addOrderBy('c.id')
      .addOrderBy('cc.id')
      .getMany();
  }

  async findByIdPlatformsGamesMiniGamesModes({
    idPlatforms,
    idGames,
    idMiniGames,
    idModes,
  }: CharacterPlatformsGamesMiniGamesModesDto): Promise<Character[]> {
    return this.createQueryBuilder('c')
      .innerJoinAndSelect('c.characterCostumes', 'cc')
      .innerJoin('cc.platformGameMiniGameModeCharacterCostumes', 'pgmmcc')
      .innerJoin('pgmmcc.platformGameMiniGameMode', 'pgmm')
      .innerJoin('pgmm.platformGameMiniGame', 'pgm')
      .innerJoin('pgm.gameMiniGame', 'gm')
      .andWhere('pgm.idPlatform in (:...idPlatforms)', { idPlatforms })
      .andWhere('gm.idGame in (:...idGames)', { idGames })
      .andWhere('gm.idMiniGame in (:...idMiniGames)', { idMiniGames })
      .andWhere('pgmm.idMode in (:...idModes)', { idModes })
      .addOrderBy('c.id')
      .addOrderBy('cc.id')
      .getMany();
  }
}
