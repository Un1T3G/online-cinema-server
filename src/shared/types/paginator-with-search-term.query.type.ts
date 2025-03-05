import { IsOptional, IsString } from 'class-validator';
import { PaginatorQuery } from './paginator.query.type';

export class PaginatorWithSearchTermQuery extends PaginatorQuery {
  @IsString()
  @IsOptional()
  searchTerm?: string;
}
