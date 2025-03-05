import { IsNotEmpty, IsString } from 'class-validator';

export class ActorUpdateDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  photoUrl: string;
}
