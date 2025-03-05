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
import { UserChangeRoleDto } from './dto/user.change-role.dto';
import { UserToggleFavoriteDto } from './dto/user.toggle-favorite.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth()
  @Get('profile')
  async getProfile(@CurrentUser('id') id: string) {
    return this.usersService.getById(id);
  }

  @Auth('admin')
  @Get()
  async getAll(@Query() query?: PaginatorWithSearchTermQuery) {
    return this.usersService.getAll(query);
  }

  @Auth('admin')
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.usersService.getById(id);
  }

  @UsePipes(new ValidationPipe())
  @Auth()
  @Put()
  async update(@CurrentUser('id') id: string, @Body() dto: UserUpdateDto) {
    return this.usersService.update(id, dto);
  }

  @Auth('admin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @UsePipes(new ValidationPipe())
  @Auth('admin')
  @Post('change-role/:id')
  async changeRole(@Param('id') id: string, @Body() dto: UserChangeRoleDto) {
    return this.usersService.changeRole(id, dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('profile/favorites')
  @Auth()
  async toggleFavorite(
    @CurrentUser('id') id: string,
    @Body() dto: UserToggleFavoriteDto,
  ) {
    return this.usersService.toggleFavorite(id, dto);
  }
}
