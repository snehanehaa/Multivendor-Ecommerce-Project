import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './product.schema';
import { CreateProductDto } from 'src/dto/create-product.dto';
import { UpdateProductDto } from 'src/dto/update-product.dto';
import { Model, Types } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  // Create
  async createProduct(dto: CreateProductDto): Promise<ProductDocument> {
    const created = new this.productModel(dto);
    return created.save();
  }

  async findAll(filters: {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;  
  }): Promise<ProductDocument[]> {
  const query: any = {};

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.brand) {
    query.brand = filters.brand;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined) query.price.$gte = +filters.minPrice;
    if (filters.maxPrice !== undefined) query.price.$lte = +filters.maxPrice;
  }

  try {
    const products = await this.productModel.find(query);

    const validProducts = products.filter((product) => {
      const isValidCategory = !product.category || Types.ObjectId.isValid(product.category);
      const isValidBrand = !product.brand || Types.ObjectId.isValid(product.brand);
      const isValidVendor = !product.vendor || Types.ObjectId.isValid(product.vendor);
      const areTagsValid = !product.tags || product.tags.every(t => Types.ObjectId.isValid(t));

      if (!isValidCategory || !isValidBrand || !isValidVendor || !areTagsValid) {
        console.warn('Invalid product:', product._id, product.category, product.brand);
      }

      return isValidCategory && isValidBrand && isValidVendor && areTagsValid;
    });

    
    const ids = validProducts.map(p => p._id);
    const populated = await this.productModel.find({ _id: { $in: ids } })
      .populate('vendor', 'email')
      .populate('category', 'name')
      .populate('brand', 'name')
      .populate('tags', 'name');

    return populated;

  } catch (error) {
    throw new Error('Failed to fetch products');
  }
  }


  // Get by ID
  async getProductById(id: string): Promise<ProductDocument> {
    const product = await this.productModel
      .findById(id)
      .populate('vendor', 'email')
      .populate('category', 'name')
      .populate('brand', 'name')
      .populate('tags', 'name');

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // Update
  async updateProduct(id: string, dto: UpdateProductDto): Promise<ProductDocument> {
    const updated = await this.productModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }

  // Delete
  async deleteProduct(id: string): Promise<void> {
    const deleted = await this.productModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Product not found');
  }

  // Toggle status
  async toggleProductStatus(id: string, isEnabled: boolean): Promise<ProductDocument> {
    const updated = await this.productModel.findByIdAndUpdate(
      id,
      { isEnabled },
      { new: true },
    );
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }
}
