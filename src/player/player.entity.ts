import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { BaseEntity } from '../shared/super/base-entity';
import { SteamProfile } from '../steam/steam-profile.entity';
import { Region } from '../region/region.entity';
import { PlayerInterface } from './player.interface';

@Entity()
export class Player extends BaseEntity implements PlayerInterface {
  @Column({ unique: true })
  personaName!: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  aboutMe?: string;

  @Column({ nullable: true })
  idUser?: number;

  @OneToOne(() => User, user => user.player)
  @JoinColumn()
  user?: User;

  @Column({ nullable: true })
  idSteamProfile?: number;

  @OneToOne(() => SteamProfile, steamProfile => steamProfile.player)
  @JoinColumn()
  steamProfile?: SteamProfile;

  @Column({ default: false })
  noUser!: boolean;

  @Column()
  idRegion!: number;

  @ManyToOne(() => Region)
  @JoinColumn()
  region!: Region;
}
