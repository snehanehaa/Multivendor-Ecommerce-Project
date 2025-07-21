import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Get()
  async getUserNotifications(@GetUser() user: any) {
    console.log('User from token:', user);
    return this.service.findByUser(user._id);
  }
  
  @Patch(':id/read')
  async markRead(@Param('id') id: string) {
    return this.service.markAsRead(id);
  }
}
