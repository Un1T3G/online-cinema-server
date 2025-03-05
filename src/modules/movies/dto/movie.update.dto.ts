import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MovieUpdateDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  poster: string;

  @IsString()
  @IsNotEmpty()
  bigPoster: string;

  @IsString()
  @IsNotEmpty()
  videoUrl: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsNumber()
  duration: number;

  @IsArray()
  @IsString({ each: true })
  genres: string[];

  @IsArray()
  @IsString({ each: true })
  actors: string[];
}
