import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SchemaEnum } from '../../environment/schema.enum';
import { BaseEntity } from '../../shared/super/base-entity';
import { Property } from '../../mapper/property.decorator';
import { Topic } from '../topic/topic.entity';
import { SubCategory } from '../sub-category/sub-category.entity';

@Entity({ schema: SchemaEnum.forum })
export class TopicTransfer extends BaseEntity {
  @Property()
  @Column()
  idTopic!: number;

  @Property(() => Topic)
  @ManyToOne(() => Topic)
  @JoinColumn()
  topic?: Topic;

  @Property()
  @Column()
  idSubCategoryFrom!: number;

  @Property(() => SubCategory)
  @ManyToOne(() => SubCategory)
  @JoinColumn({ name: 'idSubCategoryFrom' })
  subCategoryFrom?: SubCategory;

  @Property()
  @Column()
  idSubCategoryTo!: number;

  @Property(() => SubCategory)
  @ManyToOne(() => SubCategory)
  @JoinColumn({ name: 'idSubCategoryTo' })
  subCategoryTo?: SubCategory;
}
