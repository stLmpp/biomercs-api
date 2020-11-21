import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { Player } from '../player/player.entity';

@Entity()
export class SteamProfile extends BaseEntity implements RawSteamProfile {
  @Column({ unique: true })
  steamid!: string;

  @Column()
  communityvisibilitystate!: number;

  @Column()
  profilestate!: number;

  @Column()
  personaname!: string;

  @Column()
  profileurl!: string;

  @Column()
  avatar!: string;

  @Column()
  avatarmedium!: string;

  @Column()
  avatarfull!: string;

  @Column()
  avatarhash!: string;

  @Column()
  lastlogoff!: number;

  @Column()
  personastate!: number;

  @Column({ nullable: true })
  realname?: string;

  @Column({ nullable: true })
  primaryclanid?: string;

  @Column({ nullable: true })
  timecreated?: number;

  @Column()
  personastateflags!: number;

  @Column({ nullable: true })
  loccountrycode?: string;

  @OneToOne(() => Player, player => player.steamProfile)
  player?: Player;
}

export interface RawSteamProfile {
  steamid: string;
  communityvisibilitystate: number;
  profilestate: number;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  avatarhash: string;
  lastlogoff: number;
  personastate: number;
  realname?: string;
  primaryclanid?: string;
  timecreated?: number;
  personastateflags: number;
  loccountrycode?: string;
}
