import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  slug: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  parent?: Types.ObjectId; // For multi-level categories
}

export const CategorySchema = SchemaFactory.createForClass(Category);
