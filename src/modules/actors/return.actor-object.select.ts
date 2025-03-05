import { Prisma } from '@prisma/client';

export const actorSelect: Prisma.ActorSelect = {
  id: true,
  name: true,
  photoUrl: true,
  slug: true,
};
