import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { hash } from 'bcryptjs';
import { Player } from '../player/player.entity';
import { AuthConfirmation } from '../auth/auth-confirmation/auth-confirmation.entity';
import { UserInterface } from './user.interface';
import { Property } from '../mapper/mapper.service';

@Entity()
export class User extends BaseEntity implements UserInterface {
  @Column({ unique: true })
  username!: string;

  @Column({ select: false })
  @ApiHideProperty()
  password!: string;

  @Column({ select: false })
  @ApiHideProperty()
  salt!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  lastOnline?: Date;

  @Column({ nullable: true })
  rememberMe?: boolean;

  @Column({ default: false })
  admin!: boolean;

  @OneToOne(() => Player, player => player.user)
  player!: Player;

  @OneToMany(() => AuthConfirmation, authConfirmation => authConfirmation.user)
  authConfirmations!: AuthConfirmation[];

  @Column({ nullable: true, type: 'int' })
  idCurrentAuthConfirmation?: number | null;

  @OneToOne(() => AuthConfirmation)
  @JoinColumn({ name: 'idCurrentAuthConfirmation' })
  currentAuthConfirmation?: AuthConfirmation;

  @Column({ default: 'dd/MM/yyyy' })
  dateFormat!: string;

  @Property()
  token?: string;

  async validatePassword(password: string): Promise<boolean> {
    return (await hash(password, this.salt)) === this.password;
  }
}
