import { IPaginationLinks, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationMeta implements IPaginationMeta {
  currentPage!: number;
  itemCount!: number;
  itemsPerPage!: number;
  totalItems!: number;
  totalPages!: number;
}

export class PaginationLinks implements IPaginationLinks {
  @ApiPropertyOptional()
  first?: string;

  @ApiPropertyOptional()
  previous?: string;

  @ApiPropertyOptional()
  next?: string;

  @ApiPropertyOptional()
  last?: string;
}
