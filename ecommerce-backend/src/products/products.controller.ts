import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProductDto } from 'src/dto/create-product.dto';
import { UpdateProductDto } from 'src/dto/update-product.dto';
import { Request } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateProductDto, @Req() req: Request) {
    const userId = (req.user as any)._id;
    return this.productsService.createProduct({ ...dto, vendor: userId });
  }


  @Get()
  async getProducts(
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.productsService.findAll({
      category,
      brand,
      minPrice: minPrice ? +minPrice : undefined,
      maxPrice: maxPrice ? +maxPrice : undefined,
    });
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  toggleStatus(@Param('id') id: string, @Body('isEnabled') isEnabled: boolean) {
    return this.productsService.toggleProductStatus(id, isEnabled);
  }
}
