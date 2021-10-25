import { BaseEntity } from '../../shared/super/base-entity';
import { TopicInterface } from './topic.interface';
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SchemaEnum } from '../../environment/schema.enum';
import { Property } from '../../mapper/property.decorator';
import { SubCategory } from '../sub-category/sub-category.entity';
import { Score } from '../../score/score.entity';
import { PostEntity } from '../post/post.entity';
import { TopicPlayerLastRead } from '../topic-player-last-read/topic-player-last-read.entity';
import { Player } from '../../player/player.entity';

@Entity({ schema: SchemaEnum.forum })
export class Topic extends BaseEntity implements TopicInterface {
  @Property()
  @Column({ length: 150 })
  name!: string;

  @Property()
  @Column()
  idSubCategory!: number;

  @Property(() => SubCategory)
  @ManyToOne(() => SubCategory, subCategory => subCategory.topics)
  @JoinColumn()
  subCategory?: SubCategory;

  @Property()
  @Column({ type: 'int', nullable: true })
  idScore?: number | null;

  @Property(() => Score)
  @ManyToOne(() => Score, { nullable: true })
  @JoinColumn()
  score?: Score | null;

  @Property()
  @Column()
  views!: number;

  @Property()
  @Column({ default: false })
  pinned!: boolean;

  @Property()
  @Column({ type: 'timestamp', nullable: true })
  lockedDate?: Date | null;

  @Property(() => PostEntity)
  @OneToMany(() => PostEntity, post => post.topic)
  posts?: PostEntity[];

  @Property(() => TopicPlayerLastRead)
  @OneToMany(() => TopicPlayerLastRead, topicPlayerLastRead => topicPlayerLastRead.topic)
  topicPlayerLastReads?: TopicPlayerLastRead[];

  @Property()
  @Column()
  idPlayer!: number;

  @Property(() => Player)
  @ManyToOne(() => Player)
  @JoinColumn()
  player?: Player;

  @Property()
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedDate?: Date | null;
}
