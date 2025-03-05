import { IsNotEmpty, IsString } from 'class-validator';

export class AuthRefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
