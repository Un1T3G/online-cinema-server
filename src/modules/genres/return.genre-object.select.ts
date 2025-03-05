import { Prisma } from '@prisma/client';

export const genreSelect: Prisma.GenreSelect = {
  id: true,
  name: true,
  slug: true,
  icon: true,
  description: true,
};
