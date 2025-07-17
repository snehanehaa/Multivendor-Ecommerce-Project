import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Model, Types } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class WishlistService {
  constructor ( @InjectModel(Wishlist.name) private readonly wishlistModel: Model<WishlistDocument>) {}
  async getWishList(userId: string){
    return this.wishlistModel.findOne({ user: userId }).populate('products').exec()
  }
  async addToWishList(userId: string, productId: string){
    const ObjectId = new Types.ObjectId(productId);
    return this.wishlistModel.findOneAndUpdate(
      { user: userId},
      { $addToSet: { products: ObjectId} },
      { new: true, upsert: true}
    )
  }
  async removeFromWishList(userId: string, productId: string){
    const objectId = new Types.ObjectId(productId);
    return this.wishlistModel.findOneAndUpdate(
      { user: userId },
      { $pull: { products: objectId } },
      { new: true },
    )
  }

}
