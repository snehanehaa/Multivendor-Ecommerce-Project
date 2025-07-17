import { Controller, Put, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VendorService } from '../vendor/vendor.service';

@Controller('admin')
@UseGuards(JwtAuthGuard) 
export class AdminController {
  constructor(private readonly vendorService: VendorService) {}

  @Put('vendors/:id/approve')
  async approveVendor(
    @Param('id') vendorId: string,
    @Body('status') status: 'approved' | 'rejected',
  ) {
    const updatedVendor = await this.vendorService.approveVendor(vendorId, status);

    return {
      message: `Vendor "${updatedVendor.companyName}" ${status}`,
      vendor: updatedVendor,
    };
  }
}
