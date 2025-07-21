import {
    BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register/customer')
  registerCustomer(@Body() body: any) {
    return this.authService.registerCustomer(body);
  }
  @Post('register/vendor')
  registerVendor(@Body() body: any) {
    return this.authService.registerVendor(body);
  }
  @Post('register/admin')
  registerAdmin(@Body() body: any) {
    return this.authService.registerAdmin(body)
  }
  
  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }
  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }
  @Post('reset-password')
  resetPassword(@Body() body: any) {
    const { token, newPassword } = body;
    if (!token || !newPassword) {
      throw new BadRequestException('Token and new password are required');
    }
    return this.authService.resetPassword(token, newPassword);
  }

  @Post('verify-email')
  verifyEmail(@Body('token') token: string) {
  return this.authService.verifyEmail(token);
}

  @Post('send-verify-email')
  @UseGuards(JwtAuthGuard)
  sendVerifyEmail(@Req() req: any) {
    const userId = req.user._id; 
    return this.authService.sendVerificationToken(userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: Request) {
    return req.user; 
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }
}
