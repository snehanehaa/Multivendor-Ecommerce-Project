import { Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { Order, OrderDocument } from 'src/order/schemas/order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class PaymentService {
  private stripe: Stripe;
  
  constructor(
    private configService: ConfigService,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument> // ✅ direct model
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY')!, {
      apiVersion: '2025-06-30.basil',
    });
  }

  async initiatePayment(orderId: string, amount: number, currency = 'usd') {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `Order #${orderId}`,
            },
            unit_amount: amount * 100, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/success?orderId=${orderId}`,
      cancel_url: `http://localhost:3000/cancel?orderId=${orderId}`,

      metadata: {
        orderId,
      },
    });

    return { url: session.url };
  }

   async getPaymentStatus(orderId: string) {
    const order = await this.orderModel.findById(orderId);
  if (!order) {
      throw new NotFoundException('Order not found');
    }
    return {
      orderId: order._id,
      status: order.status,
    };
  }

}

