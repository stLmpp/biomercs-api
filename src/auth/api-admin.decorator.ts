import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOperation } from '@nestjs/swagger';
import { AdminGuard } from './admin.guard';

export function ApiAdmin(): any {
  return applyDecorators(
    UseGuards(AdminGuard),
    ApiForbiddenResponse({ description: 'Access denied' }),
    ApiOperation({ description: 'Requires admin privileges' })
  );
}
