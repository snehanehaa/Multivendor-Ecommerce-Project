import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { User } from 'src/users/schemas/user.schema'; // adjust if different
import { Vendor } from 'src/vendor/schemas/vendor.schema';
import { Product } from 'src/products/product.schema';


export type OrderDocument = Order & Document
@Schema({ timestamps: true })
export class Order {

  @Prop({ type: Types.ObjectId, ref: 'User', required: true})
  customer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true})
  vendor: Types.ObjectId

  @Prop([
    {
      product: { type: Types.ObjectId, ref: 'Product'},
      quantity: Number,
      price: Number
    },
  ])
  items: {
    product: Product | Types.ObjectId,
    quantity: number,
    price: number
  } [];

  @Prop({ required: true })
  totalAmount: number

  @Prop({ default: 'pending', enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']})
  status: string

  @Prop({ type: Object })
  shippingAddress: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };


  @Prop()
  paymentStatus: string;

  @Prop()
  invoiceUrl?: string;

  //shipping details

@Prop({
  type: [
    {
      vendor: { type: Types.ObjectId, ref: 'Vendor', required: true },
      shippingMethod: { type: String }, // e.g., Standard, Express
      trackingNumber: { type: String },
      deliveryTimeframe: { type: String }, // e.g., "2-4 days"
      status: { type: String, enum: ['Pending', 'Shipped', 'Delivered'], default: 'Pending' },
    },
  ],
  default: [],
  })
  shippingInfo: {
    vendor: Types.ObjectId;
    shippingMethod?: string;
    trackingNumber?: string;
    deliveryTimeframe?: string;
    status?: string;
  }[];

  @Prop({ type: [{ 
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
    status: { type: String, default: 'Pending' }
  }] })
  subOrders: {
    vendor: mongoose.Schema.Types.ObjectId;
    items: { product: mongoose.Schema.Types.ObjectId; quantity: number }[];
    status: string;
  }[];

}

export const OrderSchema = SchemaFactory.createForClass(Order)