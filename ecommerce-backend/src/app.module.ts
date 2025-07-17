import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { VendorModule } from './vendor/vendor.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { TagModule } from './tag/tag.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
        ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // 👈 points to the folder to serve
      serveRoot: '/uploads', // 👈 access via http://localhost:3000/uploads/filename
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    AuthModule,
    UsersModule,
    AdminModule,
    VendorModule,
    ProductsModule,
    CategoryModule,
    BrandModule,
    TagModule,
    CartModule,
    WishlistModule,
    PaymentModule,
  ],
  controllers: [AppController, AdminController],
  providers: [AppService],
})
export class AppModule {}
