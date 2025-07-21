import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dispute, DisputeDocument } from './schemas/dispute.schema';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Order, OrderDocument } from 'src/order/schemas/order.schema';
import { UpdateDisputeStatusDto } from './dto/update-dispute.dto';

@Injectable()
export class DisputeService {
  constructor(
    @InjectModel(Dispute.name) private disputeModel: Model<DisputeDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(userId: string, dto: CreateDisputeDto) {
    const order = await this.orderModel.findById(dto.order);
    if (!order) throw new NotFoundException('Order not found');

    if (order.customer.toString() !== userId.toString()) {
      throw new ForbiddenException('You are not allowed to dispute this order');
    }

    const already = await this.disputeModel.findOne({
      order: dto.order,
      customer: userId,
    });

    if (already) {
      throw new BadRequestException('Dispute already exists for this order');
    }

    return this.disputeModel.create({
      order: dto.order,
      customer: userId,
      reason: dto.reason,
    });
  }

  async findAll(user: UserDocument) {
    if (user.role === 'admin') {
      return this.disputeModel.find().populate('order customer').exec();
    }

    if (user.role === 'vendor') {
      return this.disputeModel
        .find()
        .populate({
          path: 'order',
          match: { vendor: user._id },
        })
        .populate('customer')
        .exec();
    }

    throw new ForbiddenException('Access denied');
  }

  async updateStatus(id: string, dto: UpdateDisputeStatusDto) {
    const dispute = await this.disputeModel.findById(id);
    if (!dispute) throw new NotFoundException('Dispute not found');

    dispute.status = dto.status;
    dispute.resolutionNote = dto.resolutionNote || '';
    return dispute.save();
  }
}
