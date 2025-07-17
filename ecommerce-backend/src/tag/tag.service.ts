// src/tag/tag.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag, TagDocument } from './schemas/tag.schema';
import { Model } from 'mongoose';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
  ) {}

  async create(dto: CreateTagDto): Promise<Tag> {
    return this.tagModel.create(dto);
  }

  async findAll(): Promise<Tag[]> {
    return this.tagModel.find();
  }
}
