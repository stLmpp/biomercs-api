import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Params } from '../../shared/type/params';
import { User } from '../../user/user.entity';
import { SubCategoryModeratorService } from './sub-category-moderator.service';
import { ApiOperation } from '@nestjs/swagger';

export function ApiModerator(): MethodDecorator {
  return applyDecorators(UseGuards(ModeratorGuard), ApiOperation({ description: 'Requires moderator privileges' }));
}

@Injectable()
export class ModeratorGuard implements CanActivate {
  constructor(private subCategoryModeratorService: SubCategoryModeratorService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const idSubCategory = +(request.params[Params.idSubCategory] ?? 0);
    if (!idSubCategory) {
      throw new InternalServerErrorException(`Route must have "${Params.idSubCategory}" to use ModeratorGuard`);
    }
    const user = request.user! as User;
    if (user.admin || user.owner) {
      return true;
    }
    return this.subCategoryModeratorService.isModerator(idSubCategory, user.player.id);
  }
}
