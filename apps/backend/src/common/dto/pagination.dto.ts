import { IsNumber, IsOptional, IsPositive } from 'class-validator';

interface PaginationMetaI {
  totalItem: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

class PaginatedDto<TData> {
  items: TData[];
  meta: PaginationMetaI;
}

class PaginationOptionsDto {
  @IsNumber()
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  offset: number;
}

export { PaginatedDto, PaginationMetaI, PaginationOptionsDto };
