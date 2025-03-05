import { Prisma } from '@prisma/client';
import { userSelect } from 'modules/users/return.user-object.select';

export const paymentSelect: Prisma.PaymentSelect = {
  id: true,
  createdAt: true,
  status: true,
  amount: true,
  user: {
    select: userSelect,
  },
};
