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
import { ActorsService } from './actors.service';
import { ActorUpdateDto } from './dto/actor.update.dto';
import { PaginatorWithSearchTermQuery } from 'shared/types/paginator-with-search-term.query.type';

@Controller('actors')
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) {}

  @Get()
  async getAll(@Query() query?: PaginatorWithSearchTermQuery) {
    return this.actorsService.getAll(query);
  }

  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.actorsService.getBySlug(slug);
  }

  @Auth('admin')
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.actorsService.getById(id);
  }

  @Auth('admin')
  @Post()
  async createEmptyActor() {
    return this.actorsService.createEmptyActor();
  }

  @UsePipes(new ValidationPipe())
  @Auth('admin')
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: ActorUpdateDto) {
    return this.actorsService.update(id, dto);
  }

  @Auth('admin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.actorsService.delete(id);
  }
}
