import { UserRole } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UserChangeRoleDto {
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
