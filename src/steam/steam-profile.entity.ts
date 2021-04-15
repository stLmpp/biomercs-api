import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { Player } from '../player/player.entity';
import { SteamProfileInterface } from './steam-profile.interface';
import { Property } from '../mapper/property.decorator';

@Entity()
export class SteamProfile extends BaseEntity implements SteamProfileInterface {
  @Property()
  @Column({ unique: true })
  steamid!: string;

  @Property()
  @Column()
  communityvisibilitystate!: number;

  @Property()
  @Column()
  profilestate!: number;

  @Property()
  @Column()
  personaname!: string;

  @Property()
  @Column()
  profileurl!: string;

  @Property()
  @Column()
  avatar!: string;

  @Property()
  @Column()
  avatarmedium!: string;

  @Property()
  @Column()
  avatarfull!: string;

  @Property()
  @Column()
  avatarhash!: string;

  @Property()
  @Column({ nullable: true })
  lastlogoff?: number;

  @Property()
  @Column()
  personastate!: number;

  @Property()
  @Column({ nullable: true })
  realname?: string;

  @Property()
  @Column({ nullable: true })
  primaryclanid?: string;

  @Property()
  @Column({ nullable: true })
  timecreated?: number;

  @Property()
  @Column()
  personastateflags!: number;

  @Property()
  @Column({ nullable: true })
  gameextrainfo?: string;

  @Property()
  @Column({ nullable: true })
  loccountrycode?: string;

  @Property()
  @Column({ nullable: true })
  gameid?: string;

  @Property(() => Player)
  @OneToOne(() => Player, player => player.steamProfile)
  player!: Player;
}
