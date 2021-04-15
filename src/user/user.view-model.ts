import { UserInterface } from './user.interface';
import { Property } from '../mapper/property.decorator';

export class UserViewModel implements UserInterface {
  @Property() id!: number;
  @Property() username!: string;
  @Property() admin!: boolean;
  @Property() dateFormat!: string;
  @Property() email!: string;
  @Property() lastOnline?: Date;
  @Property() rememberMe?: boolean;
  @Property() token!: string;
}
