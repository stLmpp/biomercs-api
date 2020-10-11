import { environment } from '../environment/environment';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export function ApiAuth(): any {
  const decorators = environment.config('USE_AUTH')
    ? [UseGuards(AuthGuard()), ApiBearerAuth(), ApiUnauthorizedResponse({ description: 'Unauthorized' })]
    : [];
  return applyDecorators(...decorators);
}
