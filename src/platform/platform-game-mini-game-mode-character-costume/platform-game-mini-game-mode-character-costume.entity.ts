import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { PlatformGameMiniGameMode } from '../platform-game-mini-game-mode/platform-game-mini-game-mode.entity';
import { CharacterCostume } from '../../character/character-costume/character-costume.entity';
import { Property } from '../../mapper/property.decorator';
import { PlatformGameMiniGameModeCharacterCostumeInterface } from './platform-game-mini-game-mode-character-costume.interface';
import { SchemaEnum } from '../../environment/schema.enum';

@Unique(['idPlatformGameMiniGameMode', 'idCharacterCostume'])
@Entity({ schema: SchemaEnum.main })
export class PlatformGameMiniGameModeCharacterCostume
  extends BaseEntity
  implements PlatformGameMiniGameModeCharacterCostumeInterface
{
  @Property()
  @Column()
  idPlatformGameMiniGameMode!: number;

  @Property(() => PlatformGameMiniGameMode)
  @ManyToOne(
    () => PlatformGameMiniGameMode,
    platformGameMiniGameMode => platformGameMiniGameMode.platformGameMiniGameModeCharacterCostumes
  )
  @JoinColumn()
  platformGameMiniGameMode!: PlatformGameMiniGameMode;

  @Property()
  @Column()
  idCharacterCostume!: number;

  @Property(() => CharacterCostume)
  @ManyToOne(() => CharacterCostume, characterCostume => characterCostume.platformGameMiniGameModeCharacterCostumes)
  @JoinColumn()
  characterCostume!: CharacterCostume;
}
