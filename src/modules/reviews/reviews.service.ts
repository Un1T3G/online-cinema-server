import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'core/prisma/prisma.service';
import { PaginatorQuery } from 'shared/types/paginator.query.type';
import { paginator } from 'shared/utils/paginator.util';
import { ReviewCreateDto } from './dto/review.create.dto';
import { reviewSelect } from './return.review-object.select';

@Injectable()
export class ReviewsService {
  constructor(private readonly prismaService: PrismaService) {}

  async leave(userId: string, movieId: string, dto: ReviewCreateDto) {
    const review = await this.prismaService.review.create({
      data: {
        ...dto,
        movie: {
          connect: {
            id: movieId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return review.id;
  }

  async getAll(query?: PaginatorQuery) {
    const pagination = paginator(query);

    return pagination(this.prismaService.review, {
      orderBy: {
        createdAt: 'desc',
      },
      select: reviewSelect,
    });
  }

  async getByMovieId(movieId: string) {
    return this.prismaService.review.findMany({
      where: {
        movieId,
      },
      select: reviewSelect,
    });
  }

  async delete(id: string) {
    const review = await this.prismaService.review.findUnique({
      where: {
        id,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.prismaService.review.delete({
      where: {
        id,
      },
    });

    return id;
  }
}
