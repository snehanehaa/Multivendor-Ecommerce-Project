import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsArray()
    @IsOptional()
    images?: string[];

    @IsString()
    category: string;

    @IsString()
    brand: string;

    @IsBoolean()
    @IsOptional()
    isEnabled?: boolean;

    @IsString()
    vendor: string;

    @IsString()
    @IsOptional()
    metaTitle?: string;

    @IsString()
    @IsOptional()
    metaDescription?: string;
}