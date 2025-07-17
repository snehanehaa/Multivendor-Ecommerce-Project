import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type VendorDocument = Vendor & Document;

@Schema({ timestamps: true })
export class Vendor {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  gstNumber: string;

  @Prop({ required: true })
  companyAddress: string;

  @Prop({ required: true})
  phoneNumber: string;

  @Prop()
  kycDocumentUrl: string;

  @Prop({ default: 'pending'})
  status: 'pending' | 'approved' | 'rejected'
}

export const VendorSchema = SchemaFactory.createForClass(Vendor)