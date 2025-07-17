import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: false }) // ✅ already updated by you
  category?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Brand', required: true })
  brand: Types.ObjectId;

  @Prop({
    type: [
      {
        color: { type: String },
        size: { type: String },
        stock: { type: Number },
        additionalPrice: { type: Number, default: 0 },
      },
    ],
    default: [],
  })
  variation: {
    color?: string;
    size?: string;
    stock: number;
    additionalPrice?: number;
  }[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop()
  metaTitle?: string;

  @Prop()
  metaDescription?: string;

  @Prop({ default: true })
  isEnabled: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  vendor: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Tag' })
  tags: Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
