import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/store'),
    ProductsModule,
    UserModule,
    AuthModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class AppModule {}

//https://blog.logrocket.com/how-build-ecommerce-app-nestjs/
