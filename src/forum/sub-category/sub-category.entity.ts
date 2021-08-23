import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SchemaEnum } from '../../environment/schema.enum';
import { BaseEntity } from '../../shared/super/base-entity';
import { SubCategoryInterface } from './sub-category.interface';
import { Property } from '../../mapper/property.decorator';
import { Category } from '../category/category.entity';
import { SubCategoryModerator } from '../sub-category-moderator/sub-category-moderator.entity';

@Entity({ schema: SchemaEnum.forum })
export class SubCategory extends BaseEntity implements SubCategoryInterface {
  @Property()
  @Column({ length: 100 })
  name!: string;

  @Property()
  @Column({ length: 1000 })
  description!: string;

  @Property()
  @Column()
  idCategory!: number;

  @Property(() => Category)
  @ManyToOne(() => Category, category => category.subCategories)
  @JoinColumn()
  category?: Category;

  @Property(() => SubCategoryModerator)
  @OneToMany(() => SubCategoryModerator, subCategoryModerator => subCategoryModerator.subCategory)
  subCategoryModerators?: SubCategoryModerator[];
}
