import { EntityRepository, Repository } from 'typeorm';
import { TopicPlayerSettings } from './topic-player-settings.entity';

@EntityRepository(TopicPlayerSettings)
export class TopicPlayerSettingsRepository extends Repository<TopicPlayerSettings> {}
