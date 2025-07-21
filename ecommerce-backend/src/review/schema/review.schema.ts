import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })

export class Review {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
        user: Types.ObjectId
    
    @Prop({ type: Types.ObjectId, ref: 'Product', required: true})
        product: Types.ObjectId
    
    @Prop({ required: true })
    rating: number;

    @Prop()
    comment?: string;

    @Prop({ default: false })
    approved: boolean

    @Prop({ default: 0 })
    averageRating: number;

    @Prop({ default: 0 })
    totalReviews: number;


}

export const Reviewschema = SchemaFactory.createForClass(Review)