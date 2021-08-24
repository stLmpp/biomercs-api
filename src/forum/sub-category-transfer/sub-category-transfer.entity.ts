import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SchemaEnum } from '../../environment/schema.enum';
import { BaseEntity } from '../../shared/super/base-entity';
import { Property } from '../../mapper/property.decorator';
import { SubCategory } from '../sub-category/sub-category.entity';
import { Category } from '../category/category.entity';

@Entity({ schema: SchemaEnum.forum })
export class SubCategoryTransfer extends BaseEntity {
  @Property()
  @Column()
  idSubCategory!: number;

  @Property(() => SubCategory)
  @ManyToOne(() => SubCategory)
  @JoinColumn()
  subCategory?: SubCategory;

  @Property()
  @Column()
  idCategoryFrom!: number;

  @Property(() => Category)
  @ManyToOne(() => Category)
  @JoinColumn({ name: 'idCategoryFrom' })
  categoryFrom?: Category;

  @Property()
  @Column()
  idCategoryTo!: number;

  @Property(() => Category)
  @ManyToOne(() => Category)
  @JoinColumn({ name: 'idCategoryTo' })
  categoryTo?: Category;
}
