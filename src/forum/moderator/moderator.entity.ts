import { BaseEntity } from '../../shared/super/base-entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Property } from '../../mapper/property.decorator';
import { Player } from '../../player/player.entity';
import { SchemaEnum } from '../../environment/schema.enum';
import { ModeratorInterface } from './moderator.interface';
import { SubCategoryModerator } from '../sub-category-moderator/sub-category-moderator.entity';

@Entity({ schema: SchemaEnum.forum })
export class Moderator extends BaseEntity implements ModeratorInterface {
  @Property()
  @Column({ unique: true })
  idPlayer!: number;

  @Property(() => Player)
  @ManyToOne(() => Player)
  @JoinColumn()
  player?: Player;

  @Property(() => SubCategoryModerator)
  @OneToMany(() => SubCategoryModerator, subCategoryModerator => subCategoryModerator.moderator)
  subCategoryModerators?: SubCategoryModerator[];
}
