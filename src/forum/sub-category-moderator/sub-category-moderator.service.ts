import { Injectable } from '@nestjs/common';
import { SubCategoryModeratorRepository } from './sub-category-moderator.repository';

@Injectable()
export class SubCategoryModeratorService {
  constructor(private subCategoryModeratorRepository: SubCategoryModeratorRepository) {}
}
