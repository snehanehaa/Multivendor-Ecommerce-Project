import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, Reviewschema } from './schema/review.schema';
import { Product, ProductSchema } from 'src/products/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: Reviewschema },
      { name: Product.name, schema: ProductSchema},
    ])
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
