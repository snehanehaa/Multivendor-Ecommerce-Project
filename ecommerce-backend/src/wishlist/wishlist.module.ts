import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { WhishlistSchema, Wishlist } from './schemas/wishlist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wishlist.name, schema: WhishlistSchema }])
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
