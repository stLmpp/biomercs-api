import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';
import { SchemaEnum } from '../../environment/schema.enum';
import { BaseEntity } from '../../shared/super/base-entity';
import { CategoryInterface } from './category.interface';
import { Property } from '../../mapper/property.decorator';
import { SubCategory } from '../sub-category/sub-category.entity';

@Entity({ schema: SchemaEnum.forum, orderBy: { order: 'ASC' } })
export class Category extends BaseEntity implements CategoryInterface {
  @Property()
  @Column({ length: 100 })
  name!: string;

  @Property(() => SubCategory)
  @OneToMany(() => SubCategory, subCategory => subCategory.category)
  subCategories?: SubCategory[];

  @Property()
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedDate?: Date | null;

  @Property()
  @Column()
  order!: number;
}
