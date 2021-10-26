import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SchemaEnum } from '../../environment/schema.enum';
import { BaseEntity } from '../../shared/super/base-entity';
import { Property } from '../../mapper/property.decorator';
import { Player } from '../../player/player.entity';
import { Topic } from '../topic/topic.entity';

@Entity({ schema: SchemaEnum.forum })
export class TopicPlayerSettings extends BaseEntity {
  @Property()
  @Column()
  idTopic!: number;

  @Property(() => Topic)
  @ManyToOne(() => Topic, topic => topic.topicPlayerSettings)
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
  @Column()
  notifications!: boolean;
}
