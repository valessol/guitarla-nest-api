import { Controller, Body, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from '../dtos/create-product.dto';
import { Product } from 'src/interfaces/product/product.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: ProductDto) {
    this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }
}
