import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
  Put,
  NotFoundException,
  ForbiddenException,
  Delete,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateAddressDto } from './dto/update-address.dto';

@UseGuards(JwtAuthGuard)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async createAddress(
    @Req() req: Request & { user: any },
    @Body() createAddressDto: CreateAddressDto,
  ) {
    const userId = req.user._id;
    return this.addressService.create(userId, createAddressDto);
  }

@Get()
  async getUser(@Req() req: Request & { user: any }) {
  const userId = req.user._id;
  return this.addressService.findAll(userId);
}
@Put(':id')
async updateAddress(
  @Param('id') id: string,
  @Body() updateAddressDto: UpdateAddressDto,
  @Req() req: Request
) {
  const userId = (req.user as any)._id;
  return this.addressService.update(userId, id, updateAddressDto); 
}

@Delete(':id')
async deleteAddress(
  @Param('id') addressId: string,
  @Req() req: Request
) {
  console.log('Logged-in user:', req.user); 
}
}
