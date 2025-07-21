// src/cart/schemas/cart.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CartItem, CartItemSchema } from './cart-item.schema';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  user?: Types.ObjectId;

  @Prop({ type: String, required: false })
  sessionToken?: string;

  @Prop({ type: [CartItemSchema], default: [] }) 
  items: CartItem[];

  _id?: Types.ObjectId;

  @Prop({ type: Object })
  shippingAddress: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}

export const CartSchema = SchemaFactory.createForClass(Cart);
