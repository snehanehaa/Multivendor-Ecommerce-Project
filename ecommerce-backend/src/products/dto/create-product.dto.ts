import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProductVariationDto {
  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsNumber()
  stock: number;

  @IsOptional()
  @IsNumber()
  additionalPrice?: number;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;
  
  @IsOptional()
  @IsMongoId()
  category?: string;

  @IsMongoId()
  vendor?: string;

  @IsMongoId()
  brand: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariationDto)
  variation?: ProductVariationDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}

