import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


export type WishlistDocument = Wishlist & Document

@Schema({ timestamps: true})

export class Wishlist{

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;
    
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Product'}] })
     products: Types.ObjectId

}

export const WhishlistSchema = SchemaFactory.createForClass(Wishlist)