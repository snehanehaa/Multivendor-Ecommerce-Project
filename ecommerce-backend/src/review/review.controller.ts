import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @UseGuards(JwtAuthGuard)
  @Post(':productId')
  async create(
    @Param('productId') productId: string,
    @Body() dto: CreateReviewDto,
    @Req() req: Request
  ){
    const userId = (req.user as any)._id
    return this.reviewService.create(productId, userId, dto)
  }

  @Get(':productId')
  async findByProduct(@Param('productId') productId: string){
    return this.reviewService.findByProduct(productId)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('admin/:id/approve')
  async approveReview(@Param('id') id: string) {
    return this.reviewService.approveReview(id);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async delete(@Param('id') id: string){
    return this.reviewService.delete(id)
  }

}
