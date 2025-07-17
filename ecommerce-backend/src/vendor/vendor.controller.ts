import { Controller, Get, UseGuards,Req, Put, Body, Post, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { UpdateVendorProfileDto } from './dto/update-vendor-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Controller('vendor')
@UseGuards(JwtAuthGuard)
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Get('profile')
  async getProfile(@Req() req: Request){
    const userId = (req.user as any)._id;
    return this.vendorService.getProfile(userId)
  }
  @Put('profile')
  async updateProfile(@Req() req: Request, @Body() UpdateVendorProfileDto: any){
    const userId = ( req.user as any)._id;
    return this.vendorService.updateProfile(userId,UpdateVendorProfileDto)
  }
  @Post('kyc')
  @UseInterceptors( 
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/kyc',
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadKyc(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = (req.user as any)._id;
    const fileUrl = `/uploads/kyc/${file.filename}`; 
    return this.vendorService.uploadKyc(userId, fileUrl);
  }
  @Get()
  async listAllVendors() {
    return this.vendorService.getAllVendor()
  }
  @Put('admin/vendor/:id/approve')
  async approveVendor(@Param('id') vendorId: string, @Body('status') status: 'approved' | 'rejected' ){
    return this.vendorService.approveVendor(vendorId, status)
  }
  }
