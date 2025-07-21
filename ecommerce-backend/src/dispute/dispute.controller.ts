import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DisputeService } from './dispute.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateDisputeStatusDto } from './dto/update-dispute.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('disputes')
@UseGuards(JwtAuthGuard)
export class DisputeController {
  constructor(private readonly disputeService: DisputeService) {}

  @Post()
  @Roles('customer')
  create(@Req() req: Request, @Body() dto: CreateDisputeDto) {
    const user = req.user as any;
    return this.disputeService.create(user._id, dto);
  }

  @Get()
  @Roles('admin', 'vendor')
  findAll(@Req() req: Request) {
    const user = req.user as any;
    return this.disputeService.findAll(user);
  }

  @Put(':id/status')
  @Roles('admin')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateDisputeStatusDto) {
    return this.disputeService.updateStatus(id, dto);
  }
}
