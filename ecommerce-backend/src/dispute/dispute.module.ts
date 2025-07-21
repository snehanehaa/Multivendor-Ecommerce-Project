import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DisputeController } from './dispute.controller';
import { DisputeService } from './dispute.service';
import { Dispute, DisputeSchema } from './schemas/dispute.schema';
import { Order, OrderSchema } from '../order/schemas/order.schema';
import { OrderModule } from '../order/order.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dispute.name, schema: DisputeSchema },
      { name: Order.name, schema: OrderSchema }, 
    ]),
    OrderModule, 
  ],
  controllers: [DisputeController],
  providers: [DisputeService],
})
export class DisputeModule {}
