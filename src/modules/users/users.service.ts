import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'core/prisma/prisma.service';
import { PaginatorWithSearchTermQuery } from 'shared/types/paginator-with-search-term.query.type';
import { paginator } from 'shared/utils/paginator.util';
import { UserChangeRoleDto } from './dto/user.change-role.dto';
import { UserCreateDto } from './dto/user.create.dto';
import { UserToggleFavoriteDto } from './dto/user.toggle-favorite.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { userSelect } from './return.user-object.select';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: string, select: Prisma.UserSelect = userSelect) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getAll(query?: PaginatorWithSearchTermQuery) {
    if (query.searchTerm) {
      return this.search(query);
    }

    const pagination = paginator({ page: query.page, perPage: query.perPage });

    return pagination(this.prismaService.user, {
      orderBy: {
        createdAt: 'desc',
      },
      select: userSelect,
    });
  }

  async getByEmail(email: string, select?: Prisma.UserSelect) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select,
    });

    return user;
  }

  async create(dto: UserCreateDto, authByOAuth: boolean = false) {
    return this.prismaService.user.create({
      data: {
        ...dto,
        authByOAuth,
      },
      select: userSelect,
    });
  }

  async update(id: string, dto: UserUpdateDto) {
    const user = await this.getById(id);

    if (user.authByOAuth && dto.email) {
      throw new BadRequestException('Email cannot be changed');
    }

    return this.prismaService.user.update({
      where: { id },
      data: dto,
      select: userSelect,
    });
  }

  async delete(id: string) {
    await this.getById(id);
    await this.prismaService.user.delete({ where: { id } });

    return id;
  }

  async toggleFavorite(userId: string, dto: UserToggleFavoriteDto) {
    const user = await this.getById(userId, {
      favorites: true,
    });

    const isExists = user.favorites.some((movie) => movie.id === dto.movieId);

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        favorites: {
          set: isExists
            ? user.favorites.filter((movie) => movie.id !== dto.movieId)
            : [...user.favorites, { id: dto.movieId }],
        },
      },
    });

    return !isExists;
  }

  async changeRole(id: string, dto: UserChangeRoleDto) {
    await this.getById(id);
    const user = await this.prismaService.user.update({
      where: { id },
      data: { role: dto.role },
    });

    return user.role;
  }

  async givePremium(id: string) {
    await this.getById(id);

    await this.prismaService.user.update({
      where: { id },
      data: { isHasPremium: true },
    });
  }

  private async search(query: PaginatorWithSearchTermQuery) {
    const { searchTerm, page, perPage } = query;

    const pagination = paginator({ page, perPage });

    return pagination(this.prismaService.user, {
      where: {
        OR: [
          {
            email: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: userSelect,
    });
  }
}
