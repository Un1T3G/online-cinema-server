import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'core/prisma/prisma.service';
import { PaginatorWithSearchTermQuery } from 'shared/types/paginator-with-search-term.query.type';
import { generateSlug } from 'shared/utils/generate-slug.util';
import { paginator } from 'shared/utils/paginator.util';
import { GenreUpdateDto } from './dto/genre.update.dto';
import { genreSelect } from './return.genre-object.select';

@Injectable()
export class GenresService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(query: PaginatorWithSearchTermQuery) {
    if (query.searchTerm) {
      return this.search(query);
    }

    const pagination = paginator({ page: query.page, perPage: query.perPage });

    return pagination(this.prismaService.genre, {
      orderBy: {
        name: 'asc',
      },
      select: genreSelect,
    });
  }

  async getById(id: string, select: Prisma.GenreSelect = genreSelect) {
    const genre = await this.prismaService.genre.findUnique({
      where: { id },
      select,
    });

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    return genre;
  }

  async getBySlug(slug: string) {
    const genre = await this.prismaService.genre.findUnique({
      where: { slug },
      select: genreSelect,
    });

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    return genre;
  }

  async createEmptyGenre() {
    const genre = await this.prismaService.genre.create({
      data: {
        name: '',
        slug: '',
        icon: '',
        description: '',
      },
    });

    return genre.id;
  }

  async update(id: string, dto: GenreUpdateDto) {
    await this.getById(id);

    const genre = await this.prismaService.genre.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug ? dto.slug : generateSlug(dto.name),
        icon: dto.icon,
        description: dto.description,
      },
    });

    return genre.id;
  }

  async delete(id: string) {
    await this.getById(id);
    await this.prismaService.genre.delete({ where: { id } });

    return id;
  }

  private search(query: PaginatorWithSearchTermQuery) {
    const { page, perPage, searchTerm } = query;

    const pagination = paginator({ page: page, perPage: perPage });

    return pagination(this.prismaService.genre, {
      where: {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      orderBy: {
        name: 'asc',
      },
      select: genreSelect,
    });
  }
}
