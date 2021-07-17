import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export function ApiAuth(): any {
  return applyDecorators(
    UseGuards(AuthGuard()),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' })
  );
}
