import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { hash } from 'bcrypt';
import { Player } from '../player/player.entity';
import { AuthConfirmation } from '../auth/auth-confirmation/auth-confirmation.entity';
import { UserInterface } from './user.interface';
import { Property } from '../mapper/property.decorator';

@Entity()
export class User extends BaseEntity implements UserInterface {
  @Property()
  @Column({ unique: true, length: 100 })
  username!: string;

  @Property()
  @Column({ select: false })
  @ApiHideProperty()
  password!: string;

  @Property()
  @Column({ select: false })
  @ApiHideProperty()
  salt!: string;

  @Property()
  @Column({ unique: true })
  email!: string;

  @Property()
  @Column({ nullable: true, type: 'timestamp' })
  lastOnline?: Date | null;

  @Property()
  @Column({ nullable: true })
  rememberMe?: boolean;

  @Property()
  @Column({ default: false })
  admin!: boolean;

  @Property(() => Player)
  @OneToOne(() => Player, player => player.user)
  player!: Player;

  @Property(() => AuthConfirmation)
  @OneToMany(() => AuthConfirmation, authConfirmation => authConfirmation.user)
  authConfirmations!: AuthConfirmation[];

  @Property()
  @Column({ nullable: true, type: 'int' })
  idCurrentAuthConfirmation?: number | null;

  @Property(() => AuthConfirmation)
  @OneToOne(() => AuthConfirmation)
  @JoinColumn({ name: 'idCurrentAuthConfirmation' })
  currentAuthConfirmation?: AuthConfirmation;

  @Property()
  @Column({ default: 'dd/MM/yyyy' })
  dateFormat!: string;

  @Property()
  @Column({ nullable: true, type: 'timestamp' })
  bannedDate?: Date | null;

  @Property()
  @Column({ default: false })
  owner!: boolean;

  @Property()
  @Column({ nullable: true, type: 'timestamp' })
  lockedDate?: Date | null;

  @Property()
  token?: string;

  async validatePassword(password: string): Promise<boolean> {
    return (await hash(password, this.salt)) === this.password;
  }

  canLogin(): boolean {
    return this.owner || (!this.lockedDate && !this.bannedDate);
  }
}
