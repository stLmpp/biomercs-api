import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { CharacterCostume } from './character-costume/character-costume.entity';
import { Property } from '../mapper/property.decorator';
import { CharacterInterface } from './character.interface';
import { SchemaEnum } from '../environment/schema.enum';

@Entity({ schema: SchemaEnum.main })
export class Character extends BaseEntity implements CharacterInterface {
  @Property()
  @Column()
  @Index()
  name!: string;

  @Property(() => CharacterCostume)
  @OneToMany(() => CharacterCostume, characterCostume => characterCostume.character)
  characterCostumes!: CharacterCostume[];
}
