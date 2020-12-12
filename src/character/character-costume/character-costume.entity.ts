import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { Character } from '../character.entity';

@Entity()
export class CharacterCostume extends BaseEntity {
  @Column()
  idCharacter!: number;

  @ManyToOne(() => Character)
  @JoinColumn()
  character!: Character;

  @Column()
  name!: string;

  @Column({ length: 15 })
  shortName!: string;
}
