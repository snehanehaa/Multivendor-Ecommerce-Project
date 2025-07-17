import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getWishlist(@Req() req) {
    return this.wishlistService.getWishList(req.user.id);
  }

  @Post(':productId')
  addToWishlist(@Param('productId') productId: string, @Req() req){
    return this.wishlistService.addToWishList(req.user.id , productId)
  }
  
  @Delete(':productId')
  removeFromWishlist(@Param('productId') productId: string, @Req() req){
    return this.wishlistService.removeFromWishList(req.user.id, productId)
  }
}
