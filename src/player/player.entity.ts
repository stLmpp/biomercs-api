import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { BaseEntity } from '../shared/super/base-entity';
import { SteamProfile } from '../steam/steam-profile.entity';
import { Region } from '../region/region.entity';
import { PlayerInterface } from './player.interface';
import { Property } from '../mapper/property.decorator';
import { InputType } from '../input-type/input-type.entity';

@Entity()
export class Player extends BaseEntity implements PlayerInterface {
  @Property()
  @Column({ unique: true, length: 100 })
  personaName!: string;

  @Property()
  @Column({ nullable: true, length: 250 })
  title?: string;

  @Property()
  @Column({ nullable: true, length: 2000 })
  aboutMe?: string;

  @Property()
  @Column({ nullable: true })
  idUser?: number;

  @Property(() => User)
  @OneToOne(() => User, user => user.player)
  @JoinColumn()
  user?: User;

  @Property()
  @Column({ nullable: true })
  idSteamProfile?: number;

  @Property(() => SteamProfile)
  @OneToOne(() => SteamProfile, steamProfile => steamProfile.player)
  @JoinColumn()
  steamProfile?: SteamProfile;

  @Property()
  @Column({ default: false })
  noUser!: boolean;

  @Property()
  @Column()
  idRegion!: number;

  @Property(() => Region)
  @ManyToOne(() => Region)
  @JoinColumn()
  region!: Region;

  @Property()
  @Column({ nullable: true })
  lastUpdatedPersonaNameDate?: Date;

  @Property()
  @Column({ nullable: true })
  idInputType?: number;

  @Property(() => InputType)
  @ManyToOne(() => InputType, { nullable: true })
  @JoinColumn()
  inputType?: InputType;
}
