import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'core/prisma/prisma.service';
import { PaginatorWithSearchTermQuery } from 'shared/types/paginator-with-search-term.query.type';
import { PaginatorQuery } from 'shared/types/paginator.query.type';
import { generateSlug } from 'shared/utils/generate-slug.util';
import { paginator } from 'shared/utils/paginator.util';
import { MovieUpdateDto } from './dto/movie.update.dto';
import { movieSelect } from './return.movie-object.select';

@Injectable()
export class MoviesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(query?: PaginatorWithSearchTermQuery) {
    if (query.searchTerm) {
      return this.search(query);
    }

    const pagination = paginator({ page: query.page, perPage: query.perPage });

    return pagination(this.prismaService.movie, {
      orderBy: {
        title: 'asc',
      },
      select: movieSelect,
    });
  }

  async getById(id: string, select: Prisma.MovieSelect = movieSelect) {
    const movie = await this.prismaService.movie.findUnique({
      where: { id },
      select,
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async getFavorites(userId: string) {
    return this.prismaService.movie.findMany({
      where: {
        userId,
      },
      select: movieSelect,
    });
  }

  async getBySlug(slug: string) {
    const movie = await this.prismaService.movie.findUnique({
      where: { slug },
      select: movieSelect,
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async getMostPopular(query?: PaginatorQuery) {
    const pagination = paginator(query);

    return pagination(this.prismaService.movie, {
      orderBy: {
        views: 'desc',
      },
      select: movieSelect,
    });
  }

  async getByActor(actorId: string, query?: PaginatorQuery) {
    const pagination = paginator(query);

    return pagination(this.prismaService.movie, {
      where: {
        actors: {
          some: {
            id: actorId,
          },
        },
      },
      select: movieSelect,
    });
  }

  async getByGenres(genreIds: string[], query?: PaginatorQuery) {
    const pagination = paginator(query);

    return pagination(this.prismaService.movie, {
      where: {
        genres: {
          some: {
            id: {
              in: genreIds,
            },
          },
        },
      },
      select: movieSelect,
    });
  }

  async createEmptyMovie() {
    const movie = await this.prismaService.movie.create({
      data: {
        title: '',
        slug: '',
        poster: '',
        bigPoster: '',
        videoUrl: '',
        actors: {
          connect: [],
        },
        genres: {
          connect: [],
        },
      },
    });

    return movie.id;
  }

  async update(id: string, dto: MovieUpdateDto) {
    await this.getById(id);

    const movie = await this.prismaService.movie.update({
      where: {
        id,
      },
      data: {
        title: dto.title,
        slug: dto.slug ? dto.slug : generateSlug(dto.title),
        poster: dto.poster,
        bigPoster: dto.bigPoster,
        videoUrl: dto.videoUrl,
        country: dto.country,
        year: dto.year,
        duration: dto.duration,
        genres: {
          set: dto.genres?.map((genreId) => ({ id: genreId })),
          disconnect: dto.genres
            ?.filter((genreId) => !dto.genres.includes(genreId))
            .map((genreId) => ({ id: genreId })),
        },
        actors: {
          set: dto.actors?.map((actorId) => ({ id: actorId })),
          disconnect: dto.actors
            ?.filter((actorId) => !dto.actors.includes(actorId))
            .map((actorId) => ({ id: actorId })),
        },
      },
    });

    return movie.id;
  }

  async delete(id: string) {
    await this.getById(id);
    await this.prismaService.movie.delete({
      where: {
        id,
      },
    });

    return id;
  }

  async updateCountViews(slug: string) {
    return this.prismaService.movie.update({
      where: {
        slug,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  private async search(query: PaginatorWithSearchTermQuery) {
    const { page, perPage, searchTerm } = query;

    const pagination = paginator({ page, perPage });

    return pagination(this.prismaService.movie, {
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: {
        title: 'asc',
      },
      select: movieSelect,
    });
  }
}
