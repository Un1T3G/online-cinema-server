import { Prisma } from '@prisma/client';
import { userSelect } from 'modules/users/return.user-object.select';

export const reviewSelect: Prisma.ReviewSelect = {
  id: true,
  createdAt: true,
  text: true,
  rating: true,
  user: {
    select: userSelect,
  },
};
