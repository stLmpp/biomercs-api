import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';

@ApiAuth()
@ApiTags('Sub Category Moderator')
@Controller()
export class SubCategoryModeratorController {}
