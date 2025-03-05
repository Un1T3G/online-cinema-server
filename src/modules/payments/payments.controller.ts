import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'shared/decorators/auth.decorator';
import { CurrentUser } from 'shared/decorators/user.decorator';
import { PaymentDto } from './dto/payment.dto';
import { PaymentStatusDto } from './dto/payment.status.dto';
import { PaymentsService } from './payments.service';
import { PaginatorQuery } from 'shared/types/paginator.query.type';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Auth('admin')
  @Get()
  async getAll(@Query() query?: PaginatorQuery) {
    return this.paymentsService.getAll(query);
  }

  @UsePipes(new ValidationPipe())
  @Auth()
  @Post()
  checkout(@CurrentUser('id') userId: string, @Body() dto: PaymentDto) {
    return this.paymentsService.checkout(userId, dto);
  }

  @Post('status')
  async updateStatus(@Body() dto: PaymentStatusDto) {
    return this.paymentsService.updateStatus(dto);
  }

  @Auth('admin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.paymentsService.delete(id);
  }
}
