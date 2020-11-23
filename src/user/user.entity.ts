import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { hash } from 'bcryptjs';
import { Player } from '../player/player.entity';
import { AuthConfirmation } from '../auth/auth-confirmation/auth-confirmation.entity';

@Entity()
export class User extends BaseEntity {
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

  token?: string;

  async validatePassword(password: string): Promise<boolean> {
    return (await hash(password, this.salt)) === this.password;
  }

  removePasswordAndSalt(): this {
    if (this.hasOwnProperty('password')) {
      this.password = '';
    }
    if (this.hasOwnProperty('salt')) {
      this.salt = '';
    }
    return this;
  }
}
