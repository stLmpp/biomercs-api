import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { Property } from '../mapper/property.decorator';
import { PlatformGameMiniGame } from './platform-game-mini-game/platform-game-mini-game.entity';
import { PlatformInterface } from './platform.interface';
import { SchemaEnum } from '../environment/schema.enum';

@Entity({ schema: SchemaEnum.main })
export class Platform extends BaseEntity implements PlatformInterface {
  @Property()
  @Column()
  @Index()
  name!: string;

  @Property()
  @Column({ length: 10 })
  @Index()
  shortName!: string;

  @OneToMany(() => PlatformGameMiniGame, platformGameMiniGame => platformGameMiniGame.platform)
  platformGameMiniGames!: PlatformGameMiniGame[];
}
