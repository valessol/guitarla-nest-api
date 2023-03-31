import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { FilterProductDTO } from './dtos/filter-product.dto';

@Controller('store/products') //@Controller decorator sets the part of the URL which is shared by all endpoints
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get('/')
  async getProducts(@Query() filterProductDTO: FilterProductDTO) {
    // use @Query decorator in the getProducts() method and the object from filter-product.dto.ts to get the query parameters from a request.
    if (Object.keys(filterProductDTO).length) {
      const filteredProducts = await this.productsService.getFilteredProducts(
        filterProductDTO,
      );
      return filteredProducts;
    } else {
      const allProducts = await this.productsService.getAllProducts();
      return allProducts;
    }
  }

  @Get('/:id')
  async getProduct(@Param('id') id: string) {
    // we use the @Param decorator to get the product ID from the URL
    const product = await this.productsService.getProduct(id);
    if (!product) throw new NotFoundException('Product does not exist!');
    return product;
  }

  @Post('/')
  async addProduct(@Body() createProductDTO: CreateProductDto) {
    // we use the @Body decorator to get the needed data from the request body and then pass it to the addProduct() method
    const product = await this.productsService.addProduct(createProductDTO);
    return product;
  }

  @Put('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() createProductDTO: CreateProductDto,
  ) {
    const product = await this.productsService.updateProduct(
      id,
      createProductDTO,
    );
    // If a product is not found, we use the NotFoundException to throw an error message
    if (!product) throw new NotFoundException('Product does not exist!');
    return product;
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    const product = await this.productsService.deleteProduct(id);
    if (!product) throw new NotFoundException('Product does not exist');
    return product;
  }
}
