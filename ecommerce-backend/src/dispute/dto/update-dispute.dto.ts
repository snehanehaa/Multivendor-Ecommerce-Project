import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateDisputeStatusDto {
  @IsIn(['pending', 'approved', 'rejected'])
  status: string;

  @IsString()
  @IsOptional()
  resolutionNote?: string;
}
