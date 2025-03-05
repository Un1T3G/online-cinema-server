import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'shared/decorators/auth.decorator';
import { PaginatorWithSearchTermQuery } from 'shared/types/paginator-with-search-term.query.type';
import { GenreUpdateDto } from './dto/genre.update.dto';
import { GenresService } from './genres.service';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  async getAll(@Query() query?: PaginatorWithSearchTermQuery) {
    return this.genresService.getAll(query);
  }

  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.genresService.getBySlug(slug);
  }

  @Auth('admin')
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.genresService.getById(id);
  }

  @Auth('admin')
  @Post()
  async createEmptyGenre() {
    return this.genresService.createEmptyGenre();
  }

  @UsePipes(new ValidationPipe())
  @Auth('admin')
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: GenreUpdateDto) {
    return this.genresService.update(id, dto);
  }

  @Auth('admin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.genresService.delete(id);
  }
}
