import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema,  }]), CartModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService, MongooseModule],
  
})
export class OrderModule {}
