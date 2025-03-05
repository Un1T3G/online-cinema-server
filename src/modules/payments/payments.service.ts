import { ConflictException, Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { PrismaService } from 'core/prisma/prisma.service';
import { UsersService } from 'modules/users/users.service';
import { PaginatorQuery } from 'shared/types/paginator.query.type';
import { paginator } from 'shared/utils/paginator.util';
import * as YooKassa from 'yookassa';
import { PaymentDto } from './dto/payment.dto';
import { PaymentStatusDto } from './dto/payment.status.dto';
import { paymentSelect } from './return.payment-object.select';

const yooKassa = new YooKassa({
  shopId: process.env['SHOP_ID'],
  secretKey: process.env['PAYMENT_TOKEN'],
});

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async getAll(query?: PaginatorQuery) {
    const pagination = paginator(query);

    return pagination(this.prismaService.payment, {
      orderBy: {
        createdAt: 'desc',
      },
      select: paymentSelect,
    });
  }

  async checkout(userId: string, dto: PaymentDto) {
    const user = await this.usersService.getById(userId);

    if (user.isHasPremium)
      throw new ConflictException('You already have a premium subscription');

    const order = await this.prismaService.payment.create({
      data: {
        status: dto.status,
        amount: dto.amount,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    const payment = await yooKassa.createPayment({
      amount: {
        value: dto.amount.toFixed(2),
        currency: 'RUB',
      },
      payment_method_data: {
        type: 'bank_card',
      },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env['CLIENT_URL']}/thanks`,
      },
      description: `Покупка подписки на Cinemahub. Id платежа #${order.id}, Id пользователя #${order.userId}`,
    });

    return payment;
  }

  async updateStatus(dto: PaymentStatusDto) {
    if (dto.event === 'payment.waiting_for_capture') {
      const payment = await yooKassa.capturePayment(dto.object.id);
      return payment;
    }

    if (dto.event === 'payment.succeeded') {
      const descriptionParts = dto.object.description.split(', ');
      const orderId = descriptionParts[0].split('#')[1];
      const userId = descriptionParts[1].split('#')[1];

      await this.prismaService.payment.update({
        where: {
          id: orderId,
        },
        data: {
          status: PaymentStatus.PAYED,
        },
      });

      await this.usersService.givePremium(userId);

      return true;
    }

    return true;
  }

  async delete(id: string) {
    const payment = await this.prismaService.payment.findUnique({
      where: {
        id,
      },
    });

    if (!payment) {
      throw new ConflictException('Payment not found');
    }

    await this.prismaService.payment.delete({
      where: {
        id,
      },
    });

    return id;
  }
}
