import {
  Controller,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
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

  @Get('/:id')
  async findById(@Param('id') id: string): Promise<Product> {
    return this.productsService.findById(Number(id));
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() createProductDto: ProductDto,
  ): Promise<Product> {
    return this.productsService.update(Number(id), createProductDto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<Product> {
    return this.productsService.delete(Number(id));
  }
}
