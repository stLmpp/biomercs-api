import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SchemaEnum } from '../../environment/schema.enum';
import { BaseEntity } from '../../shared/super/base-entity';
import { Property } from '../../mapper/property.decorator';
import { Moderator } from '../moderator/moderator.entity';
import { SubCategory } from '../sub-category/sub-category.entity';

@Entity({ schema: SchemaEnum.forum })
export class SubCategoryModerator extends BaseEntity {
  @Property()
  @Column()
  idModerator!: number;

  @Property(() => Moderator)
  @ManyToOne(() => Moderator)
  @JoinColumn()
  moderator?: Moderator;

  @Property()
  @Column()
  idSubCategory!: number;

  @Property(() => SubCategory)
  @ManyToOne(() => SubCategory, subCategory => subCategory.subCategoryModerators)
  @JoinColumn()
  subCategory?: SubCategory;
}
