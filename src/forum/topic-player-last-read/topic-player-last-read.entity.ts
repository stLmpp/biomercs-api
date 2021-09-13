import { BaseEntity } from '../../shared/super/base-entity';
import { Property } from '../../mapper/property.decorator';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Player } from '../../player/player.entity';
import { Topic } from '../topic/topic.entity';
import { SchemaEnum } from '../../environment/schema.enum';

@Unique(['idPlayer', 'idTopic'])
@Entity({ schema: SchemaEnum.forum })
export class TopicPlayerLastRead extends BaseEntity {
  @Property()
  @Column()
  idPlayer!: number;

  @Property(() => Player)
  @ManyToOne(() => Player)
  @JoinColumn()
  player?: Player;

  @Property()
  @Column()
  idTopic!: number;

  @Property(() => Topic)
  @ManyToOne(() => Topic, topic => topic.topicPlayerLastReads)
  @JoinColumn()
  topic?: Topic;

  @Property()
  @Column()
  readDate!: Date;
}
