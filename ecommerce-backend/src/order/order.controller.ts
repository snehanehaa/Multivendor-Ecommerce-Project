import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateShippingInfoDto } from './dto/update-shipping-info.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  
  @Post()
  async create(@Req() req: Request, @Body('cartId') cartId: string) {
    const user = req.user as any;
    return this.orderService.createOrderFromCart(user._id, cartId);
  }

  @Get()
  async findAll(@Req() req: Request) {
    const user = req.user as any;
    return this.orderService.findAll(user._id, user.role);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Put(':id/status')
  @Roles('admin', 'vendor')             
  @UseGuards(RolesGuard)                
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, dto);
  }

  @Get(':id/invoice')
  async invoice(@Param('id') id: string, @Res() res: Response) {
    return this.orderService.generateInvoice(id, res);
  }

}
