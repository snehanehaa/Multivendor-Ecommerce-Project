import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsNumber, IsString, ValidateNested } from "class-validator";

class OrderItemDto {
    @IsMongoId()
    product: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    price: number
}

export class CreateOrderDto {
    @IsMongoId()
    vendor: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @IsNumber()
    totalAmount: number;

    @IsString()
    shippingAddress: string;
}
