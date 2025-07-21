// src/reports/reports.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from 'src/order/schemas/order.schema';
import { FilterSalesDto } from './dto/create-report.dto';
import { Product, ProductDocument } from 'src/products/product.schema';

@Injectable()
export class ReportsService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  @InjectModel(Product.name) private productModel: Model<ProductDocument>) {}
  async getSalesSummary(userId: string, role: 'admin' | 'vendor', from?: Date, to?: Date){
    const match: any = {
      ...(role === 'vendor' ? { vendor: userId }: {}),
    };
    if (from || to){
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }
    const result = await this.orderModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalSAles: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
        }
      }
    ]);
    return result[0] || { totalSales: 0, orderCount: 0 }
  }
  async getProductPerformance(userId: string, role: 'admin' | 'vendor' ){
    const match: any = {}
    if( role === 'vendor' ) match.vendor = userId;
    const result = await this.productModel.aggregate([
      { $match: match},
      { $project: {
        name: 1,
        price: 1,
        sold: { $ifNull: ['$sold', 0] },
        stock: '$stock',
      }},
      { $sort: { sold: -1} }
    ])
    return result;
  }

  async getLowStockAlerts(threshold = 5, userId?: string, role: 'admin' | 'vendor' = 'admin'){
    const filter: any = { stock: { $lte: threshold } };
    if(role === 'vendor' ) filter.vendor = userId;
    return this.productModel.find(filter).select(' name stock')
  }
}
