import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateDisputeDto {
  @IsMongoId()
  order: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
