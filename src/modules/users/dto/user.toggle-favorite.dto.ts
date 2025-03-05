import { IsNotEmpty, IsString } from 'class-validator';

export class UserToggleFavoriteDto {
  @IsString()
  @IsNotEmpty()
  movieId: string;
}
