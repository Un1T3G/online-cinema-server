import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from 'shared/guards/auth-jwt.guard';
import { OnlyAdminGuard } from 'shared/guards/only-admin.guard';
import { TypeRole } from 'shared/types/type-role.type';

export function Auth(role: TypeRole = 'user') {
  return applyDecorators(
    role === 'admin'
      ? UseGuards(JwtAuthGuard, OnlyAdminGuard)
      : UseGuards(JwtAuthGuard),
  );
}
