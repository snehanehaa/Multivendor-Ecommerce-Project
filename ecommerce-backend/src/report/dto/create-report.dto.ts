export class CreateReportDto {}
import { IsOptional, IsDateString } from 'class-validator';

export class FilterSalesDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
