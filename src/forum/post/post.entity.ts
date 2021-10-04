import { BaseEntity } from '../../shared/super/base-entity';
import { PostInterface } from './post.interface';
import { Property } from '../../mapper/property.decorator';
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Topic } from '../topic/topic.entity';
import { Player } from '../../player/player.entity';
import { SchemaEnum } from '../../environment/schema.enum';
import { PostContent, PostContentMention } from './post-content.view-model';
import { getMentionIdsAsSetFromPostContent, getMentionsFromPostContent } from './util';

@Entity({ schema: SchemaEnum.forum })
export class PostEntity extends BaseEntity implements PostInterface {
  @Property()
  @Column({ length: 500 })
  name!: string;

  @Property()
  @Column({ type: 'json' })
  content!: PostContent;

  @Property()
  @Column()
  idTopic!: number;

  @Property(() => Topic)
  @ManyToOne(() => Topic, topic => topic.posts)
  @JoinColumn()
  topic?: Topic;

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

  getMentions(): PostContentMention[] {
    return getMentionsFromPostContent(this.content);
  }

  getMentionIdsAsSet(): Set<string> {
    return getMentionIdsAsSetFromPostContent(this.content);
  }
}
