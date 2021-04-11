import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { CharacterCostume } from './character-costume/character-costume.entity';

@Entity()
export class Character extends BaseEntity {
  @Column()
  @Index()
  name!: string;

  @OneToMany(() => CharacterCostume, characterCostume => characterCostume.character)
  characterCostumes!: CharacterCostume[];
}
