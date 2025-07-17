import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
  ) {}

  async getCart(userId?: string, sessionToken?: string) {
    const query = userId
      ? { user: new Types.ObjectId(userId) }
      : { sessionToken };
    const cart = await this.cartModel.findOne(query).populate('items.product');
    return cart ?? { items: [] };
  }

  async addToCart(
    dto: CreateCartDto,
    userId?: string,
    sessionToken?: string,
  ) {
    const query = userId
      ? { user: new Types.ObjectId(userId) }
      : { sessionToken };
    let cart = await this.cartModel.findOne(query);

    if (!cart) {
      cart = new this.cartModel({
        user: userId ? new Types.ObjectId(userId) : undefined,
        sessionToken,
        items: [],
      });
    }

    const productId = new Types.ObjectId(dto.product);
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId.toString(),
    );

    if (existingItem) {
      existingItem.quantity += dto.quantity;
    } else {
      cart.items.push({ product: productId, quantity: dto.quantity });
    }

    return cart.save();
  }

  async updateItemQuantity(
    itemId: string,
    quantity: number,
    userId?: string,
    sessionToken?: string,
  ): Promise<Cart> {
    const query = userId
      ? { user: new Types.ObjectId(userId) }
      : { sessionToken };
    const cart = await this.cartModel.findOne(query);
    if (!cart) throw new NotFoundException('Cart not found');

    const index = cart.items.findIndex(
      (item) => item._id?.toString() === itemId,
    );

    if (index === -1) throw new NotFoundException('Cart item not found');

    if (quantity < 1)
      throw new BadRequestException('Quantity must be at least 1');

    cart.items[index].quantity = quantity;
    return cart.save();
  }

  async removeItem(
    itemId: string,
    userId?: string,
    sessionToken?: string,
  ): Promise<Cart> {
    const query = userId
      ? { user: new Types.ObjectId(userId) }
      : { sessionToken };
    const cart = await this.cartModel.findOne(query);
    if (!cart) throw new NotFoundException('Cart not found');

    const index = cart.items.findIndex(
      (item) => item._id?.toString() === itemId,
    );

    if (index === -1) throw new NotFoundException('Cart item not found');

    cart.items.splice(index, 1);
    return cart.save();
  }
}
