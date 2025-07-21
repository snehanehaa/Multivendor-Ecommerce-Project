import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Headers,
  RawBodyRequest,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request } from 'express';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('initiate')
  async initiatePayment(@Body() body: { orderId: string; amount: number }) {
    return this.paymentService.initiatePayment(body.orderId, body.amount);
  }
  
  @Get('status/:orderId')
  async getPaymentStatus(@Param('orderId') orderId: string) {
    return this.paymentService.getPaymentStatus(orderId);
  }

}


