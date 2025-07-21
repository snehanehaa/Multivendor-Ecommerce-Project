import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';
import * as PDFDocument from 'pdfkit';
import { Order, OrderDocument } from './schemas/order.schema';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { Cart, CartDocument } from '../cart/schemas/cart.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
  ) {}

async createOrderFromCart(customerId: string, cartId: string) {
  const cart = await this.cartModel.findOne({
    _id: cartId,
    user: customerId,
  }).populate('items.product');

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new BadRequestException('Cart is empty or not found');
  }

  const ordersMap = new Map<string, any>();

  for (const item of cart.items) {
    const product: any = item.product;

    if (!product) {
      throw new NotFoundException(`Product not found for cart item ${item._id}`);
    }

    const vendorId = product.vendor.toString();

    if (!ordersMap.has(vendorId)) {
      ordersMap.set(vendorId, {
        customer: customerId,
        vendor: product.vendor,
        items: [],
        totalAmount: 0,
        status: 'pending',
        shippingAddress: cart.shippingAddress || {},
      });
    }

    const order = ordersMap.get(vendorId);
    order.items.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
    });

    order.totalAmount += product.price * item.quantity;
  }

  if (ordersMap.size === 0) {
    throw new BadRequestException('No valid products in cart');
  }

  const orders = await this.orderModel.insertMany(Array.from(ordersMap.values()));
  return orders;
}


  async findAll(userId: string, role: 'admin' | 'vendor' | 'customer') {
    if (role === 'admin') {
      return this.orderModel.find().populate('customer vendor items.product');
    }
    if (role === 'vendor') {
      return this.orderModel.find({ vendor: userId }).populate('customer items.product');
    }
    return this.orderModel.find({ customer: userId }).populate('vendor items.product');
  }

  async findOne(orderId: string) {
    return this.orderModel.findById(orderId).populate('customer vendor items.product');
  }

  async updateStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');
    order.status = dto.status;
    return order.save();
  }

  async generateInvoice(orderId: string, res: Response) {
    const order = await this.orderModel
      .findById(orderId)
      .populate('customer vendor items.product');

    if (!order) throw new NotFoundException('Order not found');

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);
    doc.pipe(res);

    const customer = order.customer as any;
    const vendor = order.vendor as any;
    const createdAt = (order as any).createdAt?.toDateString() || 'N/A';

    doc.fontSize(18).text('Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice ID: ${order._id}`);
    doc.text(`Customer: ${customer?.name || 'N/A'}`);
    doc.text(`Vendor: ${vendor?.name || 'N/A'}`);
    doc.text(`Date: ${createdAt}`);
    doc.moveDown();

    doc.fontSize(14).text('Items:');
    order.items.forEach((item, index) => {
      const product = item.product as any;
      doc.text(`${index + 1}. ${product?.name} - Qty: ${item.quantity} - ₹${item.price}`);
    });

    doc.moveDown();
    doc.fontSize(12).text(`Total: ₹${order.totalAmount}`, { align: 'right' });
    doc.end();
  }

}
