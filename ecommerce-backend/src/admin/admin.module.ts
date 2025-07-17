// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { VendorModule } from '../vendor/vendor.module'; 
import { JwtStrategy } from '../auth/jwt.strategy';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [UsersModule, VendorModule], 
  controllers: [AdminController],
  providers: [JwtStrategy, JwtAuthGuard],
})
export class AdminModule {}
