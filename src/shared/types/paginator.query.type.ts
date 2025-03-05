import { IsNumber, IsOptional } from 'class-validator';

export class PaginatorQuery {
  @IsNumber()
  @IsOptional()
  perPage?: number;

  @IsNumber()
  @IsOptional()
  page?: number;
}
