import { Property } from '../../mapper/property.decorator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PostEntity } from '../post/post.entity';
import { SchemaEnum } from '../../environment/schema.enum';

@Entity({ schema: SchemaEnum.forum })
export class PostHistory extends PostEntity {
  @Property()
  @Column()
  idPost!: number;

  @Property(() => PostEntity)
  @ManyToOne(() => PostEntity)
  @JoinColumn()
  post?: PostEntity;
}
