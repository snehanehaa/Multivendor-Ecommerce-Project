import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Put, BadRequestException } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getcart(@Req() req){
    const userId = req.user?.id;
    const sessionToken = req.headers['x-session-token'] as string;
    return this.cartService.getCart( userId, sessionToken )
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  addToCart(@Body() dto: CreateCartDto, @Req() req){
    const userId = req.user?.id;
    const sessionToken = req.headers['x-session-token'] as string;
    return this.cartService.addToCart(dto, userId, sessionToken)
  }
  @UseGuards(JwtAuthGuard)
  @Put(':itemId')
  async updateItem(
  @Param('itemId') itemId: string,
  @Req() req: any,
  @Body() dto: UpdateCartDto,
  ) {
  if (dto.quantity === undefined) {
    throw new BadRequestException('Quantity is required');
  }

    return this.cartService.updateItemQuantity(itemId, dto.quantity, req.user?._id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':itemId')
    async removeItem(@Param('itemId') itemId: string, @Req() req: any) {
    return this.cartService.removeItem(itemId, req.user?._id);
  }


}
