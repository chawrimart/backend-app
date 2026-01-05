import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from '../../shared/entities/product.entity';
import { ProductImage } from '../../shared/entities/product-image.entity';
import { ProductVideo } from '../../shared/entities/product-video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImage, ProductVideo])],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule { }
