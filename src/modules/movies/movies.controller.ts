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
import { CurrentUser } from 'shared/decorators/user.decorator';
import { PaginatorWithSearchTermQuery } from 'shared/types/paginator-with-search-term.query.type';
import { PaginatorQuery } from 'shared/types/paginator.query.type';
import { MovieUpdateDto } from './dto/movie.update.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async getAll(@Query() query?: PaginatorWithSearchTermQuery) {
    return this.moviesService.getAll(query);
  }

  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.moviesService.getBySlug(slug);
  }

  @Get('most-popular')
  async getMostPopular(@Query() query?: PaginatorQuery) {
    return this.moviesService.getMostPopular(query);
  }

  @Get('by-actor/:id')
  async getByActor(@Param('id') id: string, @Query() query?: PaginatorQuery) {
    return this.moviesService.getByActor(id, query);
  }

  @Auth()
  @Get('favorites')
  async getFavorites(@CurrentUser('id') userId: string) {
    return this.moviesService.getFavorites(userId);
  }

  @Post('by-genres')
  async getByGenres(
    @Body('genreIds') genreIds: string[],
    @Query() query?: PaginatorQuery,
  ) {
    return this.moviesService.getByGenres(genreIds, query);
  }

  @Put('update-count-views')
  async updateCountOpened(@Body('slug') slug: string) {
    return this.moviesService.updateCountViews(slug);
  }

  @Auth('admin')
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.moviesService.getById(id);
  }

  @Auth('admin')
  @Post()
  async create() {
    return this.moviesService.createEmptyMovie();
  }

  @UsePipes(new ValidationPipe())
  @Auth('admin')
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: MovieUpdateDto) {
    return this.moviesService.update(id, data);
  }

  @Delete(':id')
  @Auth('admin')
  async delete(@Param('id') id: string) {
    return this.moviesService.delete(id);
  }
}
