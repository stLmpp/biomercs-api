import { Injectable, PipeTransform } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { User } from '../user/user.entity';
import { Player } from '../player/player.entity';

@Injectable()
export class AuthPlayerPipe implements PipeTransform {
  constructor(private playerService: PlayerService) {}

  async transform(user: User | null): Promise<Player | null> {
    if (!user) {
      return null;
    }
    if (user.player) {
      return user.player;
    }
    return this.playerService.findByIdUser(user.id).then(player => player ?? null);
  }
}
