import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Types } from 'mongoose';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private readonly model: Model<Notification>,
  ) {}

  async create(dto: CreateNotificationDto) {
    return await this.model.create(dto);
  }

async findByUser(userId: string) {
  return await this.model
    .find({ recipient: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 });
}

  async markAsRead(id: string) {
    const updated = await this.model.findByIdAndUpdate(id, { read: true }, { new: true });
    if (!updated) throw new NotFoundException('Notification not found');
    return updated;
  }
}
