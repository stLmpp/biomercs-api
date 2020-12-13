import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { CharacterCostume } from './character-costume/character-costume.entity';

@Entity()
export class Character extends BaseEntity {
  @Column() name!: string;

  @OneToMany(() => CharacterCostume, characterCostume => characterCostume.character)
  characterCostumes!: CharacterCostume[];
}
