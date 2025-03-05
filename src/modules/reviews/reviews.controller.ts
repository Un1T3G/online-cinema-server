import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'shared/decorators/auth.decorator';
import { CurrentUser } from 'shared/decorators/user.decorator';
import { PaginatorQuery } from 'shared/types/paginator.query.type';
import { ReviewCreateDto } from './dto/review.create.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Auth('admin')
  @Get()
  async getAll(@Query() query?: PaginatorQuery) {
    return this.reviewsService.getAll(query);
  }

  @Get(':id')
  async getByMovieId(@Param('id') movieId: string) {
    return this.reviewsService.getByMovieId(movieId);
  }

  @UsePipes(new ValidationPipe())
  @Auth()
  @Post('leave/:movieId')
  async create(
    @CurrentUser('id') userId: string,
    @Param('movieId') movieId: string,
    @Body() dto: ReviewCreateDto,
  ) {
    return this.reviewsService.leave(userId, movieId, dto);
  }

  @Auth('admin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.reviewsService.delete(id);
  }
}
