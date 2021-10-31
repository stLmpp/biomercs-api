import { applyDecorators, CanActivate, ExecutionContext, Injectable, UseGuards } from '@nestjs/common';
import { getUserFromContext } from './auth-user.decorator';
import { Request } from 'express';
import { PlayerService } from '../player/player.service';
import { ApiOperation } from '@nestjs/swagger';

@Injectable()
export class PlayerOrAdminGuard implements CanActivate {
  constructor(private playerService: PlayerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const idPlayer = +(context.switchToHttp().getRequest<Request>().params.idPlayer ?? 0);
    const user = getUserFromContext(context);
    const player = user.player ?? (await this.playerService.findByIdUser(user.id));
    return !idPlayer || user.admin || player?.id === idPlayer;
  }
}

export function ApiPlayerOrAdmin(): any {
  return applyDecorators(
    UseGuards(PlayerOrAdminGuard),
    ApiOperation({ description: 'Requires admin privileges or same player' })
  );
}
