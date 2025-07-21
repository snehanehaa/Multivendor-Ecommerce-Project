// src/reports/reports.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsController } from './report.controller';
import { ReportsService } from './report.service';
import { Order, OrderSchema } from 'src/order/schemas/order.schema';
import { Product, ProductSchema } from 'src/products/product.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema },
    { name: Product.name, schema: ProductSchema },
  ])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
