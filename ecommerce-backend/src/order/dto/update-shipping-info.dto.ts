import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateShippingInfoDto {
  @IsOptional()
  @IsString()
  shippingMethod?: string;

  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @IsOptional()
  @IsString()
  deliveryTimeframe?: string;

  @IsOptional()
  @IsIn(['Pending', 'Shipped', 'Delivered'])
  status?: 'Pending' | 'Shipped' | 'Delivered';
}
