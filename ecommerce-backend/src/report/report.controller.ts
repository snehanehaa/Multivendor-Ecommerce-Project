// src/reports/reports.controller.ts
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ReportsService } from './report.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FilterSalesDto } from './dto/create-report.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Request } from 'express';

@Controller('reports')
  @UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  @Roles('admin', 'vendor')
  async getSales(
    @Req() req: Request,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const user = req.user as any;
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;
    return this.reportsService.getSalesSummary(user._id, user.role, fromDate, toDate);
  }

  @Get('products')
  @Roles('admin', 'vendor')
  async getProductPerformance(@Req() req: Request ){
    const user = req.user as any;
    
    return this.reportsService.getProductPerformance(user._id, user.role)
  }
  @Get('stock-alerts')
  @Roles('admin', 'vendor')
  async getLowStockAlerts(@Req() req: Request, @Query('threshold') threshold = 5){
    const user = req.user as any;
    return this.reportsService.getLowStockAlerts(+threshold, user._id, user.role)
  }
}
