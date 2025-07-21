import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from './schema/review.schema';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from 'src/products/product.schema';

@Injectable()
export class ReviewService {
constructor (
  @InjectModel(Review.name) private reviewModel: Model <ReviewDocument>,
  @InjectModel(Product.name) private productModel: Model <ProductDocument>
) {}

  async create(productId: string, userId: string, dto: CreateReviewDto): Promise<ReviewDocument>{
    const existingReview = await this.reviewModel.findOne({ product: productId, user: userId })
    if(existingReview) throw new Error('you already review this product')
      const review = await this.reviewModel.create({
    product: productId,
    user: userId,
    ...dto, 
    });
    await this.updateRating(productId)
    return review
  }

  async findByProduct(productId: string): Promise<ReviewDocument[]>{
    return this.reviewModel
    .find({ product: productId, approved: true })
    .populate('user', 'name')
    .sort({ createdAt: -1 })
  }

  async delete(id: string): Promise<void>{
    const review = await this.reviewModel.findById(id);
    if (!review) throw new NotFoundException('review not found');
    await review.deleteOne()
    await this.updateRating(review.product.toString());
  }
  async approveReview(id: string): Promise<ReviewDocument> {
    const review = await this.reviewModel.findById(id);
    if (!review) throw new NotFoundException('Review not found');

    review.approved = true;
    await review.save();

    await this.updateRating(review.product.toString());
    return review;
  }

  async updateRating(productId: string){
    const result = await this.reviewModel.aggregate([
      { $match:{ product: new Types.ObjectId(productId), approved: true }},
      { $group: {
        _id: '$product',
        averageRating: { $avg: '$rating'},
        totalReviews: { $sum: 1 },
      }}
    ]);
    const data = result[0] || { averageRating: 0, totalReviews: 0 };
    await this.productModel.findByIdAndUpdate(productId, {
      averageRating: data.averageRating,
      totalReviews: data.totalReviews
    })
  }
}
