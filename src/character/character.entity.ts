import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { CharacterCostume } from './character-costume/character-costume.entity';
import { Property } from '../mapper/property.decorator';

@Entity()
export class Character extends BaseEntity {
  @Property()
  @Column()
  @Index()
  name!: string;

  @Property(() => CharacterCostume)
  @OneToMany(() => CharacterCostume, characterCostume => characterCostume.character)
  characterCostumes!: CharacterCostume[];
}
