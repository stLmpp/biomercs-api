import { EntityRepository, Repository } from 'typeorm';
import { SteamProfile } from './steam-profile.entity';

@EntityRepository(SteamProfile)
export class SteamProfileRepository extends Repository<SteamProfile> {}
