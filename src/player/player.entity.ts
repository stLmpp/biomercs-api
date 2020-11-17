import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { BaseEntity } from '../shared/super/base-entity';
import { SteamProfile } from '../steam/steam-profile.entity';

@Entity()
export class Player extends BaseEntity {
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

  @OneToOne(() => SteamProfile)
  @JoinColumn()
  steamProfile?: SteamProfile;
}
