import { UserInterface } from './user.interface';
import { Property } from '../mapper/property.decorator';

export class UserViewModel implements UserInterface {
  @Property() id!: number;
  @Property() username!: string;
  @Property() admin!: boolean;
  @Property() dateFormat!: string;
  @Property() email!: string;
  @Property(() => Date) lastOnline?: Date | null;
  @Property() rememberMe?: boolean;
  @Property() token!: string;
  @Property(() => Date) bannedDate?: Date | null;
  @Property() idPlayer?: number;
  @Property() playerPersonaName?: string;
}
