import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'core/prisma/prisma.service';
import { PaginatorWithSearchTermQuery } from 'shared/types/paginator-with-search-term.query.type';
import { generateSlug } from 'shared/utils/generate-slug.util';
import { paginator } from 'shared/utils/paginator.util';
import { ActorUpdateDto } from './dto/actor.update.dto';
import { actorSelect } from './return.actor-object.select';

@Injectable()
export class ActorsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(query?: PaginatorWithSearchTermQuery) {
    if (query?.searchTerm) {
      return this.search(query);
    }

    const pagination = paginator({ page: query.page, perPage: query.perPage });

    return pagination(this.prismaService.actor, {
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getById(id: string, select: Prisma.ActorSelect = actorSelect) {
    const actor = await this.prismaService.actor.findUnique({
      where: { id },
      select,
    });

    if (!actor) {
      throw new NotFoundException('Actor not found');
    }

    return actor;
  }

  async createEmptyActor() {
    const actor = await this.prismaService.actor.create({
      data: {
        name: '',
        photoUrl: '',
        slug: '',
      },
    });

    return actor.id;
  }

  async update(id: string, dto: ActorUpdateDto) {
    await this.getById(id);

    const actor = await this.prismaService.actor.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        slug: dto.slug ? dto.slug : generateSlug(dto.name),
        photoUrl: dto.photoUrl,
      },
    });

    return actor.id;
  }

  async getBySlug(slug: string) {
    const actor = await this.prismaService.actor.findUnique({
      where: { slug },
      select: {
        ...actorSelect,
        movies: true,
      },
    });

    if (!actor) {
      throw new NotFoundException('Actor not found');
    }

    return actor;
  }

  async delete(id: string) {
    await this.getById(id);
    await this.prismaService.actor.delete({
      where: { id },
    });

    return id;
  }

  private search(query: PaginatorWithSearchTermQuery) {
    const { searchTerm, page, perPage } = query;

    const pagination = paginator({ page, perPage });

    return pagination(this.prismaService.actor, {
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
