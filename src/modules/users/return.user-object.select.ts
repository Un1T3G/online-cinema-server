import { Prisma } from '@prisma/client';

export const userSelect: Prisma.UserSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  isHasPremium: true,
  authByOAuth: true,
  role: true,
  createdAt: true,
};
